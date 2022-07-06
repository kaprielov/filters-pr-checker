import axios from 'axios';
import {
    FilterListType,
    FilterType,
    FILTER_LIST_URL,
    RECOMMENDED_TAG_ID,
} from './constants';

const dataFromResponse = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        const message = `Error status: ${error}. URL: ${url}`;
        // eslint-disable-next-line no-console
        console.log(message);
        throw error;
    }
};

// Filters by ids. If no ids, return recommended filters
export const fetchTargetFilters = async (id: string[] | undefined) => {
    const json: FilterListType = await dataFromResponse(FILTER_LIST_URL);
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
            const text = await dataFromResponse(url);
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
