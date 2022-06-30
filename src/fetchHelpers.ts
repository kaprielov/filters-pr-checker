import fetch, { Response } from 'node-fetch';

export const fetchResponse = async (url: string): Promise<Response> => {
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

// TODO fix any
export const jsonFromResponse = async (url: string): Promise<any> => {
    const response = await fetchResponse(url);
    const json = await response.json();
    return json;
};
