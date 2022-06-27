import fetch from 'node-fetch';

import { FILTER_LIST_URL } from './constants';

export const fetchFiltersByTag = async (tag: number) => {
    const response = await fetch(FILTER_LIST_URL);
    if (!response.ok) {
        const message = `Error status: ${response.status}. URL: ${FILTER_LIST_URL}`;
        throw new Error(message);
    }
    const data: any = await response.json();
    const recommended = data.filters
    // TODO fix any
        .filter((filter: any) => filter.tags.includes(tag));
    const urlList = recommended.map(
    // TODO fix any
        (filter: any) => filter.subscriptionUrl,
    );

    const filters = await Promise.all(
        urlList.map(async (url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                const message = `Error status: ${response.status}. URL: ${url}`;
                throw new Error(message);
            }
            const text = await response.text();
            return text;
        }),
    );

    return filters;
};
