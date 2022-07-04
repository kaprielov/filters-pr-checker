import { URL_MARK } from '../src/constants';
import { applyDiffToString, getStringFromDescription } from '../src/helpers';

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
    describe('applyDiffToString', () => {
        it('removed string', () => {
            const diff = ` example.org##h1
-example.org##p`;
            const filtersDefault = `example.org##h1
example.org##p`;
            expect(applyDiffToString(diff, filtersDefault)).toBe('example.org##h1');
        });
        it('add string', () => {
            const diff = ` example.org##h1
+example.org##p`;
            const filtersDefault = 'example.org##h1';
            expect(applyDiffToString(diff, filtersDefault)).toBe(`example.org##h1
example.org##p`);
        });
        it('add and remove with complex diff', () => {
            const diff = `--git a/tests/filter.txt b/tests/filter.txt
index a3f7caa..74f8404 100644
--- a/tests/filter.txt
+++ b/tests/filter.txt
@@ -8255,7 +8255,7 @@ susterbokep.com##.overlay
 bokepml.online##.s-sponsor
 ibugil.net##.semprotpokemon_1
 ibugil.net##.semprotpokemon_2
-example.org
+example.org##p
 semprot.com,semprotku.com##a[href^="http://bit.ly/"]
 nekopoi.care,nekopoi.cash,nekopoi.lol##div[class^="adsgen"]
 nekopoi.care,nekopoi.cash,nekopoi.lol##div[class^="mobileads"]`;
            const filtersDefault = 'example.org';
            expect(applyDiffToString(diff, filtersDefault)).toBe('example.org##p');
        });
    });
});
