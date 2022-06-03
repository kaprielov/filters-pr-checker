export const getValueFromDescription = (desc: string, key: string): string | null => {
    const rawLines = desc.split('\n');
    const lines = rawLines.map((line) => line.trim());
    const lineWithKey = lines.find((line) => line.trim().startsWith(key));
    if (!lineWithKey) {
        return null;
    }

    const rawUrl = lineWithKey.substring(key.length);
    const value = rawUrl.trim();
    return value;
};

const URL_MARK = '#url:';

export const getUrlFromDescription = (desc: string): string | null => {
    const rawLines = desc.split('\n');
    const lines = rawLines.map((line) => line.trim());
    const lineWithUrl = lines.find((line) => line.trim().startsWith(URL_MARK));
    if (!lineWithUrl) {
        return null;
    }

    const rawUrl = lineWithUrl.substring(URL_MARK.length);
    const url = rawUrl.trim();
    return url;
};
