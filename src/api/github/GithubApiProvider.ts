import _ from 'lodash';

import { githubApi } from './GithubApi';
import {
    CreateCommentParams,
    GetContentParams,
    GetFilesParams,
    GetPullRequestParams,
} from './GithubApiInterfaces';

class GithubApiProvider {
    // eslint-disable-next-line class-methods-use-this
    async getPullRequest(params: GetPullRequestParams) {
        const response = await githubApi.getPullRequest(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get pull request by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        const { data } = response;

        return {
            body: data.body,
            head: {
                owner: _.get(data.head, 'user.login'),
                repo: _.get(data.head, 'repo.name'),
                sha: _.get(data.head, 'sha'),
            },
            base: {
                owner: _.get(data.base, 'user.login'),
                repo: _.get(data.base, 'repo.name'),
                sha: _.get(data.base, 'sha'),
            },
        };
    }

    // eslint-disable-next-line class-methods-use-this
    async getPullRequestFiles(params: GetFilesParams) {
        const response = await githubApi.getPullRequestFiles(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get pull request files by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        // TODO handle statuses (modified, removed, added, etc)
        const filenames = response.data.map((fileData) => fileData.filename);

        return filenames;
    }

    // eslint-disable-next-line class-methods-use-this
    async getContent(params: GetContentParams) {
        const response = await githubApi.getContent(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get content by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        return response.data;
    }

    // eslint-disable-next-line class-methods-use-this
    async createComment(params: CreateCommentParams) {
        const response = await githubApi.createComment(params);

        return response.data;
    }
}

export { GithubApiProvider };
