import axios from 'axios';
import {
    FilterListType,
    FilterType,
    FILTER_LIST_URL,
    RECOMMENDED_TAG_ID,
} from './constants';

const fetchResponse = async (url: string) => {
    try {
        const response = await axios.get('/user?ID=12345');
        return response.data;
    } catch (error) {
        const message = `Error status: ${error}. URL: ${url}`;
        // eslint-disable-next-line no-console
        console.log(message);
        throw error;
    }
};

const textFromResponse = async (url: string) => {
    const response = await fetchResponse(url);
    const text = await response.text();
    return text;
};

// Filters by ids. If no ids, return recommended filters
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

export const fetchFilterNames = async (filters: FilterType[]) => {
    const nameList = filters.map(
        (filter: FilterType) => ({ name: filter.name, url: filter.subscriptionUrl }),
    );

    return nameList;
};
