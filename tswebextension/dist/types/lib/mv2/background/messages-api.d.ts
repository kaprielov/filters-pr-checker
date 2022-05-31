import { Runtime } from 'webextension-polyfill';
import { Message, FilteringLog } from '../../common';
export interface MessagesApiInterface {
    sendMessage: (tabId: number, message: unknown) => void;
    handleMessage: (message: Message, sender: Runtime.MessageSender) => Promise<unknown>;
    addAssistantCreateRuleListener: (listener: (ruleText: string) => void) => void;
}
export declare class MessagesApi implements MessagesApiInterface {
    filteringLog: FilteringLog;
    /**
     * Assistant event listener
     */
    onAssistantCreateRuleListener: undefined | ((ruleText: string) => void);
    constructor(filteringLog: FilteringLog);
    sendMessage(tabId: number, message: unknown): void;
    /**
     * Adds listener on rule created by assistant content script
     *
     * @param listener
     */
    addAssistantCreateRuleListener(listener: (ruleText: string) => void): void;
    handleMessage(message: Message, sender: Runtime.MessageSender): Promise<string | boolean | {
        ruleText: string;
        match: string | null;
        isThirdParty: boolean;
        filterId: number;
        isAllowlist: boolean;
    }[] | undefined>;
    private handleProcessShouldCollapseMessage;
    private handleGetExtendedCssMessage;
    /**
     * Handles messages
     * Returns cookie rules data for content script
     *
     * @param sender
     * @param payload
     */
    private handleGetCookieRulesMessage;
    /**
     * Calls filtering to add an event from cookie-controller content-script
     *
     * @param sender
     * @param payload
     */
    private handleSaveCookieLogEvent;
    /**
     * Handles message with new rule from assistant content script
     *
     * @param sender
     * @param payload
     */
    private handleAssistantCreateRuleMessage;
}
export declare const messagesApi: MessagesApi;
