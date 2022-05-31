/// <reference types="chrome" />
import { Message } from '../../common';
import { TsWebExtension } from './app';
export default class MessagesApi {
    private tsWebExtension;
    constructor(tsWebExtension: TsWebExtension);
    /**
     * Handles message
     * @param message message
     * @param sender sender of message
     * @returns data according to the received message
     */
    handleMessage(message: Message, sender: chrome.runtime.MessageSender): Promise<{
        css: string[];
        extendedCss: string[];
    } | undefined>;
    /**
     * Builds css for specified url
     * @param url url for which build css
     * @returns cosmetic css
     */
    private getCss;
}
