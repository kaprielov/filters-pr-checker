export const getValueFromDescription = (desc: string, key: string): string | null => {
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
