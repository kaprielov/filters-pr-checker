import { FILTER_LIST_URL } from './constants';
import { jsonFromResponse, textFromResponse } from './fetchHelpers';

// TODO fix any
export const fetchFiltersByTag = async (tag: number) => {
    const data = await jsonFromResponse(FILTER_LIST_URL);
    const recommended = data.filters
        .filter((filter: any) => filter.tags.includes(tag));

    const urlList = recommended.map(
        (filter: any) => filter.subscriptionUrl,
    );

    const filters = await Promise.all(
        urlList.map(async (url: string) => {
            const text = await textFromResponse(url);
            return text;
        }),
    );

    return filters;
};
