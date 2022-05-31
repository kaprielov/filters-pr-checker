import { messagesApi } from './messages-api';
import { AppInterface, SiteStatus, MessageType, Configuration } from '../../common';
export interface ManifestV2AppInterface extends AppInterface<Configuration> {
    getMessageHandler: () => typeof messagesApi.handleMessage;
}
export declare class TsWebExtension implements ManifestV2AppInterface {
    isStarted: boolean;
    configuration: Configuration | undefined;
    onFilteringLogEvent: import("../../common").EventChannel<import("../../common").FilteringLogEvent>;
    /**
     * Constructor
     *
     * @param webAccessibleResourcesPath
     */
    constructor(webAccessibleResourcesPath: string);
    start(configuration: Configuration): Promise<void>;
    stop(): Promise<void>;
    configure(configuration: Configuration): Promise<void>;
    openAssistant(tabId: number): void;
    closeAssistant(tabId: number): void;
    getSiteStatus(url: string): SiteStatus;
    getRulesCount(): number;
    getMessageHandler(): (message: {
        payload?: unknown;
        type: MessageType;
        handlerName: "tsWebExtension";
    }, sender: import("webextension-polyfill").Runtime.MessageSender) => Promise<string | boolean | {
        ruleText: string;
        match: string | null;
        isThirdParty: boolean;
        filterId: number;
        isAllowlist: boolean;
    }[] | undefined>;
    /**
     * Adds ruleText to user rules
     *
     * @param ruleText
     */
    private addUserRule;
    /**
     * recursively merge changes to passed confuguration
     * @returns new confuguration
     *
     * using for immutably update the config object
     * and pass it to {@link configure} or {@link start} method
     * which will validate the configuration
     */
    static mergeConfiguration(configuration: Configuration, changes: Partial<Configuration>): {
        settings: {
            allowlistInverted: boolean;
            collectStats: boolean;
            stealth: {
                blockChromeClientData: boolean;
                hideReferrer: boolean;
                hideSearchQueries: boolean;
                sendDoNotTrack: boolean;
                blockWebRTC: boolean;
                selfDestructThirdPartyCookies: boolean;
                selfDestructThirdPartyCookiesTime: number;
                selfDestructFirstPartyCookies: boolean;
                selfDestructFirstPartyCookiesTime: number;
            };
        };
        filters: {
            content: string;
            filterId: number;
        }[];
        allowlist: string[];
        userrules: string[];
        verbose: boolean;
    };
}
