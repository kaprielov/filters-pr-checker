/// <reference types="chrome" />
import { AppInterface, SiteStatus, Configuration } from '../../common';
export declare class TsWebExtension implements AppInterface<Configuration> {
    onFilteringLogEvent: import("../../common").EventChannel<import("../../common").FilteringLogEvent>;
    configuration: Configuration | undefined;
    isStarted: boolean;
    private startPromise;
    /**
     * Web accessible resources path in the result bundle
     * relative to the root dir. Should start with leading slash '/'
     */
    private readonly webAccessibleResourcesPath;
    /**
     * Constructor
     *
     * @param webAccessibleResourcesPath string path to web accessible resourses,
     * relative to the extension root dir. Should start with leading slash '/'
     */
    constructor(webAccessibleResourcesPath?: string);
    /**
     * Runs configuration process via saving promise to inner startPromise
     */
    private innerStart;
    /**
     * Starts filtering
     */
    start(config: Configuration): Promise<void>;
    /**
     * Stops service, disables all user rules and filters
     */
    stop(): Promise<void>;
    /**
     * Uses configuration to pass params to filters, user rules and filter engine
     */
    configure(config: Configuration): Promise<void>;
    openAssistant(): void;
    closeAssistant(): void;
    getSiteStatus(): SiteStatus;
    getRulesCount(): number;
    /**
     * @returns messages handler
     */
    getMessageHandler(): (message: {
        payload?: unknown;
        type: import("../../common").MessageType;
        handlerName: "tsWebExtension";
    }, sender: chrome.runtime.MessageSender) => Promise<{
        css: string[];
        extendedCss: string[];
    } | undefined>;
}
