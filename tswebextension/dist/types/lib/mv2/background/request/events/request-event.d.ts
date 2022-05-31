import { WebRequest, Events } from 'webextension-polyfill';
import { RequestContext } from '../request-context-storage';
/**
 * Extended {@link EventCallback} argument data
 */
export interface RequestData<Details> {
    details: Details;
    context?: RequestContext;
}
export declare type DetailsHandler<Details> = (details: Details) => RequestData<Details>;
/**
 * Callback function passed as {@link RequestEvent} methods argument
 *
 */
export declare type EventCallback<Details> = (requestData: RequestData<Details>) => WebRequest.BlockingResponseOrPromise | void;
/**
 * Function registered as listener of the browser.WebRequest event
 */
export declare type BrowserEventListener<Details> = (details: Details) => WebRequest.BlockingResponseOrPromise | void;
/**
 * More flexible variants for {@link Events.Event} interfaces
 */
export interface BrowserRequstEvent<Details, Options> extends Events.Event<BrowserEventListener<Details>> {
    addListener(callback: BrowserEventListener<Details>, filter: WebRequest.RequestFilter, extraInfoSpec?: Options[]): void;
}
/**
 * browser.webRequest generic wrapper with custom event implementation
 */
export declare class RequestEvent<Details, Options> {
    listeners: EventCallback<Details>[];
    constructor(event: BrowserRequstEvent<Details, Options>, handler: DetailsHandler<Details>, filter: WebRequest.RequestFilter, extraInfoSpec?: Options[]);
    addListener(listener: EventCallback<Details>): void;
    removeListener(listener: EventCallback<Details>): void;
}
