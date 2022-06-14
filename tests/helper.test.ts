import { URL_MARK } from '../src/constants';
import { getStringFromDescription } from '../src/helpers';

describe('helpers', () => {
    describe('getUrlFromDescription', () => {
        it('parses url', () => {
            const url = 'https://example.org';
            const text = `#url: ${url}`;
            expect(getStringFromDescription(text, URL_MARK)).toBe(url);
        });

        it('parses url in the multiple string description', () => {
            const url = 'https://example.org';
            const text = `
            this is my pr
            #url: ${url}
            `;
            expect(getStringFromDescription(text, URL_MARK)).toBe(url);
        });
    });
});
