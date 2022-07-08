import _ from 'lodash';
import { GetPullRequestRequestType } from '../../constants';

import { githubApi } from './GithubApi';
import {
    CreateCommentParams,
    CreateCommentResponse,
    GetContentParams,
    GetContentResponse,
    GetFilesParams,
    GetPullRequestParams,
    GetPullRequestResponse,
} from './GithubApiInterfaces';

class GithubApiProvider {
    // eslint-disable-next-line class-methods-use-this
    async getPullRequest(params: GetPullRequestParams): Promise<GetPullRequestRequestType> {
        const response = await githubApi.getPullRequest(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get pull request by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        const { data } = response;

        return {
            body: data.body,
            diffUrl: data.diff_url,
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
    async getPullRequestDiff(params: GetPullRequestParams): Promise<GetPullRequestResponse['data']> {
        const response = await githubApi.getPullRequest(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get pull request by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        const { data } = response;

        return data;
    }

    // eslint-disable-next-line class-methods-use-this
    async getPullRequestFiles(params: GetFilesParams): Promise<string[]> {
        const response = await githubApi.getPullRequestFiles(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get pull request files by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        // TODO handle statuses (modified, removed, added, etc)
        const filenames = response.data.map((fileData) => fileData.filename);

        return filenames;
    }

    // eslint-disable-next-line class-methods-use-this
    async getContent(params: GetContentParams): Promise<GetContentResponse['data']> {
        const response = await githubApi.getContent(params);

        if (response.status !== 200) {
            throw new Error(`Couldn't get content by params: ${JSON.stringify(params)}, status: ${response.status}`);
        }

        return response.data;
    }

    // eslint-disable-next-line class-methods-use-this
    async createComment(params: CreateCommentParams): Promise<CreateCommentResponse['data']> {
        const response = await githubApi.createComment(params);

        return response.data;
    }
}

export { GithubApiProvider };
