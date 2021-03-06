export const REGEXP_PROTOCOL = /^https?/;

export const BASE_ERROR_MESSAGE = 'Failed to check this pull request. \r\nThe filters PR checker failed to check this pull request due to';

export const ERRORS_MESSAGES = {
    INVALID_URL: 'invalid URL format',
    SCREENSHOT_NOT_UPLOAD: 'no screenshots were received',
    PR_DESC_REQUIRED: 'pull request description is required',
    URL_REQUEST_REQUIRED: 'URL in the pull request is required',
    NO_FILTERS: 'no filters to check',
    FILTERS_DEFAULT: 'problem of getting default filters',
};

export const URL_MARK = '#url:';
export const FILTER_LIST_MARK = '#filters:';

export const RECOMMENDED_TAG_ID = 10;
export const FILTER_LIST_URL = 'https://filters.adtidy.org/extension/chromium/filters.json';

export const HYPHEN_MINUS = '-';
export const PLUS_SIGN = '+';

export const MEDIA_TYPE_SHA = 'sha';
export const MEDIA_TYPE_DIFF = 'diff';
export const MEDIA_TYPE_RAW = 'raw';

export type FilterType = {
    filterId: number,
    name: string,
    description: string,
    timeAdded: string,
    homepage: string,
    expires: number,
    displayNumber: number,
    groupId: number,
    subscriptionUrl: string,
    trustLevel: string,
    version: string,
    timeUpdated: string,
    languages: string[],
    tags: number[],
};

export type FilterListType = {
    groups: [
        {
            groupId: number,
            groupName: string,
            displayNumber: number,
        },
    ],
    filters: FilterType[],
};

export type FilterNamesType = {
    name: string,
    url: string,
};

export type GetPullRequestRequestType = {
    body: string | null,
    diffUrl: string,
    head: {
        owner: string,
        repo: string,
        sha: string,
    },
    base: {
        owner: string,
        repo: string,
        sha: string,
    },
};
