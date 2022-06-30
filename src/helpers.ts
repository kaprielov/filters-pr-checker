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

export const applyDiffToString = (diff: string, string: string) => {
    const diffLines = diff.split('\n');
    const stringLines = string.split('\n');

    const result = diffLines.reduce((acc, line) => {
        const lineType = line.charAt(0);
        const lineContent = line.substring(1);

        const filePath = lineContent.match(/^([-+])(.*)$/);

        if (lineType === '-' && !filePath) {
            return acc.filter((string) => string !== lineContent);
        }

        if (lineType === '+' && !filePath) {
            return [...acc, lineContent];
        }

        return acc;
    }, stringLines);

    return result.join('\n');
};
