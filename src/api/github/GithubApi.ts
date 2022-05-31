import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

import {
    CreateCommentParams,
    CreateCommentResponse,
    GetContentParams,
    GetContentResponse,
    GetFilesParams,
    GetFilesResponse,
    GetPullRequestParams,
    GetPullRequestResponse,
} from './GithubApiInterfaces';

class GithubApi {
    private octokit: InstanceType<typeof GitHub>;

    constructor() {
        const repoToken = core.getInput('repo_token', { required: true });
        this.octokit = github.getOctokit(repoToken);
    }

    getPullRequest = async (params: GetPullRequestParams): Promise<GetPullRequestResponse> => {
        const {
            owner,
            repo,
            pullNumber,
        } = params;

        return this.octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: pullNumber,
        });
    };

    getPullRequestFiles = async (
        { owner, repo, pullNumber }: GetFilesParams,
    ): Promise<GetFilesResponse> => {
        return this.octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: pullNumber,
        });
    };

    getContent = async ({
        owner,
        repo,
        path,
        ref,
    }: GetContentParams): Promise<GetContentResponse> => {
        return this.octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref,
            mediaType: { format: 'raw' },
        });
    };

    createComment = async ({
        owner,
        repo,
        issueNumber,
        body,
    }: CreateCommentParams): Promise<CreateCommentResponse> => {
        return this.octokit.rest.issues.createComment({
            owner,
            repo,
            body,
            issue_number: issueNumber,
            mediaType: { format: 'raw' },
        });
    };
}

export const githubApi = new GithubApi();
