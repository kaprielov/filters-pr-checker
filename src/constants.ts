export const REGEXP_PROTOCOL = /^https?/;

export const BASE_ERROR_MESSAGE = 'Failed to check this pull request. \r\nThe filters PR checker failed to check this pull request due to';

export const ERRORS_MESSAGES = {
    INVALID_URL: 'invalid URL format',
    SCREENSHOT_NOT_UPLOAD: 'no screenshots were received',
    PR_DESC_REQUIRED: 'pull request description is required',
    URL_REQUEST_REQUIRED: 'URL in the pull request is required',
    NO_FILTERS: 'no filters to check',
};

export const URL_MARK = '#url:';
export const FILTER_LIST_MARK = '#filters:';

export const FILTER_EXT = '.txt';

// TODO 29 is not a RECOMMENDED_TAG_ID, replace it with 1
export const RECOMMENDED_TAG_ID = 29;
export const FILTER_LIST_URL = 'https://filters.adtidy.org/extension/chromium/filters.json';
