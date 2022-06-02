import 'dotenv/config';

import * as core from '@actions/core';
import * as gh from '@actions/github';
import { github, imgur } from './api';
import { getUrlFromDescription } from './helpers';
import { screenshot } from './screenshot';
import { extension } from './extension';

const REGEXP_PROTOCOL = /^https?/;

const BASE_ERROR_MESSAGE = 'The filters PR checker failed to check this pull request due to';

const ERRORS_MESSAGES = {
    INVALID_URL: 'invalid URL format',
    SCREENSHOT_NOT_UPLOAD: 'no screenshots were received',
    PR_DESC_REQUIRED: 'pull request description is required',
    URL_REQUEST_REQUIRED: 'URL in the pull request is required',
};

const setMessage = (result: string) => {
    return `This pull request has been checked by the AdGuard filters pull request checker: \r\n${result}`;
};

const { runId } = gh.context;
const { owner, repo } = gh.context.repo;
const pullNumber = gh.context.payload.number;

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
    });

    if (!prInfo.body) {
        throw new Error(ERRORS_MESSAGES.PR_DESC_REQUIRED);
    }

    const url = getUrlFromDescription(prInfo.body);

    if (!url) {
        throw new Error(ERRORS_MESSAGES.URL_REQUEST_REQUIRED);
    }

    const pullRequestFiles = await github.getPullRequestFiles({
        owner,
        repo,
        pullNumber,
    });

    const baseFileContent = await github.getContent({
        owner: prInfo.base.owner,
        repo: prInfo.base.repo,
        path: pullRequestFiles[0],
        ref: prInfo.base.sha,
    });

    const headFileContent = await github.getContent({
        owner: prInfo.head.owner,
        repo: prInfo.head.repo,
        path: pullRequestFiles[0],
        ref: prInfo.head.sha,
    });

    if (!url.match(REGEXP_PROTOCOL)) {
        throw new Error(ERRORS_MESSAGES.INVALID_URL);
    }

    const context = await extension.start();

    await extension.config(context, baseFileContent.toString());
    const baseScreenshot = await screenshot(context, { url, path: 'base_image.jpeg' });

    await extension.config(context, headFileContent.toString());
    const headScreenshot = await screenshot(context, { url, path: 'head_image.jpeg' });

    await context.browserContext.close();

    const [baseLink, headLink] = await Promise.all([
        imgur.upload(baseScreenshot),
        imgur.upload(headScreenshot),
    ]);

    const success = `Screenshot without new rules: ![baseScreenshot](${baseLink}) \r\nScreenshot with the new rules: ![headScreenshot](${headLink})`;

    if (!baseLink || !headLink) {
        throw new Error(ERRORS_MESSAGES.SCREENSHOT_NOT_UPLOAD);
    }

    const body = setMessage(success);

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
        const body = `${setMessage(`${BASE_ERROR_MESSAGE} ${e.message}`)} \r\n[Current run](https://github.com/${owner}/${repo}/actions/runs/${runId})`;

        await github.createComment({
            repo,
            owner,
            issueNumber: pullNumber,
            body,
        });
        core.setFailed(e.message);
    }
})();
