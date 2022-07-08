import { chromium, BrowserContext, Page } from 'playwright-chromium';
import path from 'path';

const EXTENSION_PATH = path.resolve(__dirname, './extension');

export interface Context {
    browserContext: BrowserContext,
    backgroundPage: Page,
}

const start = async () => {
    const userDataDir = '/tmp/test-user-data-dir';
    const browserContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
        args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`,
        ],
    });

    const backgroundPages = browserContext.backgroundPages();
    const backgroundPage = backgroundPages.length
        ? backgroundPages[0]
        : await browserContext.waitForEvent('backgroundpage');

    await backgroundPage.waitForFunction(
        () => window.tsWebExtension.isStarted,
        null,
        { polling: 100 },
    );

    return {
        browserContext,
        backgroundPage,
    };
};

const config = async (context: Context, rulesText: string) => {
    await context.backgroundPage.evaluate(async (rulesText: string) => {
        await window.tsWebExtension.configure(Object.assign(window.tsWebExtension.configuration, {
            filters: [{
                filterId: 1,
                content: rulesText,
            }],
        }));
    }, rulesText);
};

export const extension = {
    start,
    config,
};
