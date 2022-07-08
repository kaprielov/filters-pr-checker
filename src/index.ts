import 'dotenv/config';

import * as core from '@actions/core';
import * as gh from '@actions/github';
import {
    URL_MARK,
    REGEXP_PROTOCOL,
    ERRORS_MESSAGES,
    BASE_ERROR_MESSAGE,
    FILTER_LIST_MARK,
    FilterNamesType,
    MEDIA_TYPE_SHA,
    MEDIA_TYPE_DIFF,
    FilterType,
} from './constants';
import { github, imgur } from './api';
import { getStringFromDescription, applyDiffToString } from './strings';
import {
    fetchTargetFilters,
    fetchFiltersText,
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
            format: MEDIA_TYPE_SHA,
        },
    });

    if (!prInfo.body) {
        throw new Error(ERRORS_MESSAGES.PR_DESC_REQUIRED);
    }

    const url = getStringFromDescription(prInfo.body, URL_MARK);

    if (!url) {
        throw new Error(ERRORS_MESSAGES.URL_REQUEST_REQUIRED);
    }

    if (!url.match(REGEXP_PROTOCOL)) {
        throw new Error(ERRORS_MESSAGES.INVALID_URL);
    }

    const targetFiltersIds = getStringFromDescription(prInfo.body, FILTER_LIST_MARK)
        ?.split(';').map((path) => path.trim());

    // 1. Get filters by ids. If no ids, gets recommended filters
    const targetFilters = await fetchTargetFilters(targetFiltersIds);
    const filtersDefault = await fetchFiltersText(targetFilters);

    if (!filtersDefault) {
        throw new Error(ERRORS_MESSAGES.FILTERS_DEFAULT);
    }

    // 2. Get diff with filter changes
    const diff = await github.getPullRequestDiff({
        owner,
        repo,
        pullNumber,
        mediaType: {
            format: MEDIA_TYPE_DIFF,
        },
    });

    // 3. Get filter string with changes from diff
    const filtersModified = applyDiffToString(diff.toString(), filtersDefault.join('\n'));

    const context = await extension.start();

    // 4. Apply a no-diff filter string to get a screenshot without changes
    await extension.config(context, filtersDefault.join('\n'));
    const baseScreenshot = await screenshot(context, { url, path: 'base_image.jpeg' });

    // 5. Apply a diff filter string to get a screenshot with changes
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

    // Filter names with urls, used to print in a comment
    const filterNames = targetFilters.map(
        (filter: FilterType) => ({ name: filter.name, url: filter.subscriptionUrl }),
    );

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
