import fetch, { Response } from 'node-fetch';
import { FilterListType, FilterType, FILTER_LIST_URL } from './constants';

const fetchResponse = async (url: string): Promise<Response> => {
    const response = await fetch(url);
    if (!response.ok) {
        const message = `Error status: ${response.status}. URL: ${url}`;
        throw new Error(message);
    }
    return response;
};

export const textFromResponse = async (url: string): Promise<string> => {
    const response = await fetchResponse(url);
    const text = await response.text();
    return text;
};

export const fetchFiltersByTag = async (tag: number) => {
    const data = await textFromResponse(FILTER_LIST_URL);
    const json: FilterListType = JSON.parse(data);
    const recommended = json.filters
        .filter((filter: FilterType) => filter.tags.includes(tag));

    const urlList = recommended.map(
        (filter: FilterType) => filter.subscriptionUrl,
    );

    const filters = await Promise.all(
        urlList.map(async (url: string) => {
            const text = await textFromResponse(url);
            return text;
        }),
    );

    return filters;
};
