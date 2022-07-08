import { HYPHEN_MINUS, PLUS_SIGN } from './constants';

/**
 * Extracting key information from the pull request description
 * @param desc
 * @param key
 */
export const getStringFromDescription = (desc: string, key: string): string | null => {
    const rawLines = desc.split(/\r?\n/);
    const lines = rawLines.map((line) => line.trim());
    const lineWithKey = lines.find((line) => line.trim().startsWith(key));
    if (!lineWithKey) {
        return null;
    }

    const rawString = lineWithKey.substring(key.length);
    return rawString.trim();
};

/**
 * Applies the pull request diff to the filters
 * @param diff
 * @param string
 */
export const applyDiffToString = (diff: string, string: string): string => {
    const diffLines = diff.split(/\r?\n/);
    const stringLines = string.split(/\r?\n/);

    const result = diffLines.reduce((acc, line) => {
        const lineType = line.charAt(0);
        const lineContent = line.substring(1);

        const filePath = lineContent.match(/^([-+])(.*)$/);

        if (lineType === HYPHEN_MINUS && !filePath) {
            return acc.filter((string) => string !== lineContent);
        }

        if (lineType === PLUS_SIGN && !filePath) {
            return [...acc, lineContent];
        }

        return acc;
    }, stringLines);

    return result.join('\n');
};
