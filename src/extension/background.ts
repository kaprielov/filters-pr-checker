import { TsWebExtension, Configuration } from '@adguard/tswebextension';

const tsWebExtension = new TsWebExtension('war');

/*
 * Need for access tsWebExtension instance form browser autotest tool
 */
declare global {
    interface Window {
        tsWebExtension: TsWebExtension;
    }
}

window.tsWebExtension = tsWebExtension;

const defaultConfig: Configuration = {
    filters: [],
    allowlist: [],
    userrules: [],
    verbose: false,
    settings: {
        collectStats: false,
        allowlistInverted: false,
        stealth: {
            blockChromeClientData: false,
            hideReferrer: false,
            hideSearchQueries: false,
            sendDoNotTrack: false,
            blockWebRTC: false,
            selfDestructThirdPartyCookies: false,
            selfDestructThirdPartyCookiesTime: 3600,
            selfDestructFirstPartyCookies: false,
            selfDestructFirstPartyCookiesTime: 3600,
        },
    },
};

tsWebExtension.start(defaultConfig);
