import { github } from '../../src/api';
import { githubApi } from '../../src/api/github/GithubApi';
import { GetPullRequestResponse } from '../../src/api/github/GithubApiInterfaces';

jest.mock('@actions/core');
jest.mock('@actions/github');

describe('api', () => {
    describe('getPullRequest', () => {
        it('picks data from pull request', async () => {
            const data = {
                status: 200,
                data: {
                    head: {
                        user: {
                            login: 'headOwner',
                        },
                        repo: {
                            name: 'headRepo',
                        },
                        sha: 'headSha',
                    },
                    base: {
                        user: {
                            login: 'baseOwner',
                        },
                        repo: {
                            name: 'baseRepo',
                        },
                        sha: 'headSha',
                    },
                },
            };

            jest
                .spyOn(githubApi, 'getPullRequest')
                .mockResolvedValue(data as unknown as GetPullRequestResponse);

            const pullRequestData = await github.getPullRequest({ owner: 'test', repo: 'test', pullNumber: 1 });
            expect(pullRequestData).toEqual({
                head: {
                    owner: data.data.head.user.login,
                    repo: data.data.head.repo.name,
                    sha: data.data.head.sha,
                },
                base: {
                    owner: data.data.base.user.login,
                    repo: data.data.base.repo.name,
                    sha: data.data.base.sha,
                },
            });
        });
    });
});
