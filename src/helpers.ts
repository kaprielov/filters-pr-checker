import fetch from 'node-fetch';

export const getStringFromDescription = (desc: string, key: string): string | null => {
    const rawLines = desc.split('\n');
    const lines = rawLines.map((line) => line.trim());
    const lineWithKey = lines.find((line) => line.trim().startsWith(key));
    if (!lineWithKey) {
        return null;
    }

    const rawString = lineWithKey.substring(key.length);
    const value = rawString.trim();
    return value;
};

// TODO fix any
export const fetchResponse = async (url: string): Promise<any> => {
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
