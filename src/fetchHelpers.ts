import axios from 'axios';
import {
    FilterListType,
    FilterType,
    FILTER_LIST_URL,
    RECOMMENDED_TAG_ID,
} from './constants';

const fetchData = async (url: string): Promise<FilterListType> => {
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

/**
 * Filters by ids. If no ids, returns recommended filters
 * @param idList
 */
export const fetchTargetFilters = async (idList?: string[]): Promise<FilterType[]> => {
    const json: FilterListType = await fetchData(FILTER_LIST_URL);
    if (idList) {
        const targetFilters = json.filters
            .filter((filter: FilterType) => idList.includes(filter.filterId.toString()));
        return targetFilters;
    }

    const recommendedFilters = json.filters
        .filter((filter: FilterType) => filter.tags.includes(RECOMMENDED_TAG_ID));

    return recommendedFilters;
};

export const fetchFiltersText = async (filters: FilterType[]): Promise<FilterListType[]> => {
    const urlList = filters.map(
        (filter: FilterType) => filter.subscriptionUrl,
    );

    const filtersText = await Promise.all(
        urlList.map(async (url: string) => {
            const text = await fetchData(url);
            return text;
        }),
    );

    return filtersText;
};
