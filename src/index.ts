import 'dotenv/config';

import * as core from '@actions/core';
import * as gh from '@actions/github';
import {
    URL_MARK,
    REGEXP_PROTOCOL,
    ERRORS_MESSAGES,
    BASE_ERROR_MESSAGE,
    FILTER_LIST_MARK,
    FILTER_EXT,
    FilterNamesType,
} from './constants';
import { github, imgur } from './api';
import { getStringFromDescription, applyDiffToString } from './helpers';
import {
    textFromResponse,
    fetchTargetFilters,
    fetchFiltersText,
    fetchFilterNames,
} from './fetchHelpers';
import { screenshot } from './screenshot';
import { extension } from './extension';

const { runId } = gh.context;
const { owner, repo } = gh.context.repo;
const pullNumber = gh.context.payload.number;

const LINK_TO_THE_RUN = `https://github.com/${owner}/${repo}/actions/runs/${runId}`;

const setMessage = (result: string) => {
    return `Checked by the [filters-pr-checker](${LINK_TO_THE_RUN}) \r\n${result}`;
};

/**
 * - gets filter before pr
 * - makes screenshot before.jpg
 * - gets filter after pr
 * - makes screenshot after.jpg
 * - appends screenshots in comment to current pr
 */
const run = async () => {
    const prInfo = await github.getPullRequest({
        owner,
        repo,
        pullNumber,
        mediaType: {
            format: 'sha',
        },
    });

    const prInfoDiff = await github.getPullRequestDiff({
        owner,
        repo,
        pullNumber,
        mediaType: {
            format: 'diff',
        },
    });

    if (!prInfo.body) {
        throw new Error(ERRORS_MESSAGES.PR_DESC_REQUIRED);
    }

    console.log('my_prInfoDiff', prInfoDiff);

    const url = getStringFromDescription(prInfo.body, URL_MARK);

    if (!url) {
        throw new Error(ERRORS_MESSAGES.URL_REQUEST_REQUIRED);
    }

    if (!url.match(REGEXP_PROTOCOL)) {
        throw new Error(ERRORS_MESSAGES.INVALID_URL);
    }

    const targetFiltersIds = getStringFromDescription(prInfo.body, FILTER_LIST_MARK)
        ?.split(';').map((path) => path.trim());

    // Filters by ids. If no ids, gets recommended filters
    const targetFilters = await fetchTargetFilters(targetFiltersIds);

    const filtersDefault = await fetchFiltersText(targetFilters);

    const filterNames = await fetchFilterNames(targetFilters);

    if (!filtersDefault) {
        throw new Error(ERRORS_MESSAGES.FILTERS_DEFAULT);
    }

    const diff = await textFromResponse(prInfo.diffUrl);

    const filtersModified = applyDiffToString(diff, filtersDefault.join('\n'));

    const context = await extension.start();

    await extension.config(context, filtersDefault.join('\n'));
    const baseScreenshot = await screenshot(context, { url, path: 'base_image.jpeg' });

    await extension.config(context, filtersModified);
    const headScreenshot = await screenshot(context, { url, path: 'head_image.jpeg' });

    await context.browserContext.close();

    const [baseLink, headLink] = await Promise.all([
        imgur.upload(baseScreenshot),
        imgur.upload(headScreenshot),
    ]);

    const printFilesList = (files: FilterNamesType[]) => {
        return files.map((filer) => `  * [${filer.name}](${filer.url})\r\n`).join('');
    };

    const success = `This PR has been checked by the [filters-pr-checker](${LINK_TO_THE_RUN}).
* The page URL: \`${url}\`
* Filter lists:
  <details>

  ${printFilesList(filterNames)}
  </details>

<details>
<summary>Screenshot without new rules</summary>

![](${baseLink})
</details>
<details>
<summary>Screenshot with the new rules:</summary>

![](${headLink})
</details>`;

    if (!baseLink || !headLink) {
        throw new Error(ERRORS_MESSAGES.SCREENSHOT_NOT_UPLOAD);
    }

    const body = `### ✅ ${setMessage(success)}`;

    await github.createComment({
        repo,
        owner,
        issueNumber: pullNumber,
        body,
    });
};

(async () => {
    try {
        await run();
    } catch (e) {
        const body = `### 🔴 ${setMessage(`${BASE_ERROR_MESSAGE} ${e.message}`)}`;

        await github.createComment({
            repo,
            owner,
            issueNumber: pullNumber,
            body,
        });
        core.setFailed(e.message);
    }
})();
