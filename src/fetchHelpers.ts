import fetch, { Response } from 'node-fetch';
import {
    FilterListType,
    FilterType,
    FILTER_LIST_URL,
    RECOMMENDED_TAG_ID,
} from './constants';

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

export const fetchTargetFilters = async (id: string[] | undefined) => {
    const data = await textFromResponse(FILTER_LIST_URL);
    const json: FilterListType = JSON.parse(data);
    if (id) {
        const targetFilters = json.filters
            .filter((filter: FilterType) => id.includes(filter.filterId.toString()));
        return targetFilters;
    }

    const recommendedFilters = json.filters
        .filter((filter: FilterType) => filter.tags.includes(RECOMMENDED_TAG_ID));

    return recommendedFilters;
};

export const fetchFiltersText = async (filters: FilterType[]) => {
    const urlList = filters.map(
        (filter: FilterType) => filter.subscriptionUrl,
    );

    const filtersText = await Promise.all(
        urlList.map(async (url: string) => {
            const text = await textFromResponse(url);
            return text;
        }),
    );

    return filtersText;
};

export const fetchFiltersName = async (filters: FilterType[]) => {
    const nameList = filters.map(
        (filter: FilterType) => filter.name,
    );

    return nameList;
};
