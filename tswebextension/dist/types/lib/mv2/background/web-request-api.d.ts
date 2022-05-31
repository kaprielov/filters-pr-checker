import { WebRequest } from 'webextension-polyfill';
export declare type WebRequestEventResponse = WebRequest.BlockingResponseOrPromise | void;
export declare class WebRequestApi {
    static start(): void;
    static stop(): void;
    private static onBeforeRequest;
    private static onBeforeSendHeaders;
    private static onHeadersReceived;
    private static onResponseStarted;
    private static onCompleted;
    private static onErrorOccurred;
    private static onCommitted;
    private static recordFrameInjection;
    private static injectJsScript;
    private static injectCosmetic;
}
