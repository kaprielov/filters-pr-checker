import 'dotenv/config';

import * as core from '@actions/core';
import * as gh from '@actions/github';
import { github, imgur } from './api';
import { getUrlFromDescription } from './helpers';
import { screenshot } from './screenshot';
import { extension } from './extension';

/**
 * - gets filter before pr
 * - makes screenshot before.jpg
 * - gets filter after pr
 * - makes screenshot after.jpg
 * - appends screenshots in comment to current pr
 */
const run = async () => {
    const { owner, repo } = gh.context.repo;
    const pullNumber = gh.context.payload.number;

    const prInfo = await github.getPullRequest({
        owner,
        repo,
        pullNumber,
    });

    if (!prInfo.body) {
        throw new Error('Pull request description is required');
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

    const url = getUrlFromDescription(prInfo.body);

    if (!url) {
        throw new Error('URL in the pull request is required');
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

    const body = `before: ![baseScreenshot](${baseLink}) \r\nafter: ![headScreenshot](${headLink})`;

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
        core.setFailed(e.message);
    }
})();
