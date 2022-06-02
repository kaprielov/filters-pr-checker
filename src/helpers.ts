export const getValueFromDescription = (desc: string, mark: string): string | null => {
    const rawLines = desc.split('\n');
    const lines = rawLines.map((line) => line.trim());
    const lineWithUrl = lines.find((line) => line.trim().startsWith(mark));
    if (!lineWithUrl) {
        return null;
    }

    const rawUrl = lineWithUrl.substring(mark.length);
    const value = rawUrl.trim();
    return value;
};
