// TODO add test
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
