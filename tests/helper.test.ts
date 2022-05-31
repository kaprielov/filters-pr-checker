import { getUrlFromDescription } from '../src/helpers';

describe('helpers', () => {
    describe('getUrlFromDescription', () => {
        it('parses url', () => {
            const url = 'https://example.org';
            const text = `#url: ${url}`;
            expect(getUrlFromDescription(text)).toBe(url);
        });

        it('parses url in the multiple string description', () => {
            const url = 'https://example.org';
            const text = `
            this is my pr
            #url: ${url}
            `;
            expect(getUrlFromDescription(text)).toBe(url);
        });
    });
});
