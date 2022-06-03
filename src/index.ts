import 'dotenv/config';

import * as core from '@actions/core';
import * as gh from '@actions/github';
import { github, imgur } from './api';
import { getValueFromDescription } from './helpers';
import {
    URL_MARK,
    REGEXP_PROTOCOL,
    DEFAULT_MESSAGE,
    ERRORS_MESSAGES,
    BASE_ERROR_MESSAGE,
    FILTER_LIST_MARK,
    FILTER_EXT,
} from './constants';
import { screenshot } from './screenshot';
import { extension } from './extension';

const setMessage = (result: string) => {
    return `${DEFAULT_MESSAGE} \r\n${result}`;
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

    const url = getValueFromDescription(prInfo.body, URL_MARK);

    if (!url) {
        throw new Error(ERRORS_MESSAGES.URL_REQUEST_REQUIRED);
    }

    const pullRequestFiles = await github.getPullRequestFiles({
        owner,
        repo,
        pullNumber,
    });

    const filterList = getValueFromDescription(prInfo.body, FILTER_LIST_MARK)?.split(';');

    const targetFiles = pullRequestFiles.filter(
        (fileName) => {
            if (filterList) {
                return filterList.find((filter) => fileName === filter.trim());
            }

            return fileName.includes(FILTER_EXT);
        },
    );

    if (targetFiles.length === 0) {
        throw new Error(ERRORS_MESSAGES.NO_FILTERS);
    }

    const baseFilesContentArr = await Promise.all(targetFiles.map(async (name) => {
        const baseFileContent = await github.getContent({
            owner: prInfo.base.owner,
            repo: prInfo.base.repo,
            path: name,
            ref: prInfo.base.sha,
        });

        return baseFileContent;
    }));

    const headFilesContentArr = await Promise.all(targetFiles.map(async (name) => {
        const headFileContent = await github.getContent({
            owner: prInfo.head.owner,
            repo: prInfo.head.repo,
            path: name,
            ref: prInfo.head.sha,
        });

        return headFileContent;
    }));

    if (!url.match(REGEXP_PROTOCOL)) {
        throw new Error(ERRORS_MESSAGES.INVALID_URL);
    }

    const context = await extension.start();

    await extension.config(context, baseFilesContentArr.join('\n'));
    const baseScreenshot = await screenshot(context, { url, path: 'base_image.jpeg' });

    await extension.config(context, headFilesContentArr.join('\n'));
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
