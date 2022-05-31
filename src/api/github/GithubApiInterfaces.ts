import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

export type GetPullRequestResponse = RestEndpointMethodTypes['pulls']['get']['response'];
export type GetFilesResponse = RestEndpointMethodTypes['pulls']['listFiles']['response'];
export type GetContentResponse = RestEndpointMethodTypes['repos']['getContent']['response'];
export type CreateCommentResponse = RestEndpointMethodTypes['issues']['createComment']['response'];

export interface GetPullRequestParams {
    owner: string,
    repo: string,
    pullNumber: number,
}

export type GetFilesParams = GetPullRequestParams;

export interface GetContentParams {
    owner: string,
    repo: string,
    path: string,
    ref: string,
}

export interface CreateCommentParams {
    owner: string,
    repo: string,
    issueNumber: number,
    body: string,
}
