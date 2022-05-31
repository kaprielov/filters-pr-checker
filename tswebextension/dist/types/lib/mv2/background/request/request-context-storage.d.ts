import { WebRequest } from 'webextension-polyfill';
import { CosmeticResult, MatchingResult, RequestType } from '@adguard/tsurlfilter';
import { ContentType } from './request-type';
import ParsedCookie from '../services/cookie-filtering/parsed-cookie';
import { EventChannel, EventChannelInterface } from '../../../common';
export declare const enum RequestContextState {
    BEFORE_REQUEST = "BEFORE_REQUEST",
    BEFORE_SEND_HEADERS = "BEFORE_SEND_HEADERS",
    SEND_HEADERS = "SEND_HEADERS",
    HEADERS_RECEIVED = "HEADERS_RECEIVED",
    AUTH_REQUIRED = "AUTH_REQUIRED",
    BEFORE_REDIRECT = "BEFORE_REDIRECT",
    RESPONSE_STARTED = "RESPONSE_STARTED",
    COMPLETED = "COMPLETED",
    ERROR = "ERROR"
}
/**
 * Request context data
 */
export declare type RequestContext = {
    state: RequestContextState;
    requestId: string;
    tabId: number;
    frameId: number;
    timestamp: number;
    requestUrl?: string;
    referrerUrl?: string;
    requestType?: RequestType;
    contentType?: ContentType;
    requestFrameId?: number;
    thirdParty?: boolean;
    requestHeaders?: WebRequest.HttpHeaders;
    responseHeaders?: WebRequest.HttpHeaders;
    method?: string;
    statusCode?: number;
    cookies?: ParsedCookie[];
    contentTypeHeader?: string;
    /**
     * filtering data from {@link EngineApi.matchRequest}
     */
    matchingResult?: MatchingResult | null;
    /**
     * filtering data from {@link EngineApi.getCosmeticResult}
     */
    cosmeticResult?: CosmeticResult;
};
/**
 * Managing requests context api.
 * Each request has a {@link RequestContext} with unique key: requestId
 */
export declare type RequestStorageEvent = {
    id: string;
    data: RequestContext;
};
export interface RequestContextStorageInterface {
    /**
     * Get request by requestId
     */
    get: (requestId: string) => RequestContext | undefined;
    /**
     * Record request context. If context with passed id is exist, it will be overwritten
     */
    record: (requestId: string, data: RequestContext) => RequestContext;
    /**
     * Update request context fields
     */
    update: (requestId: string, data: Partial<RequestContext>) => void;
    /**
     * Delete request context
     */
    delete: (requestId: string) => void;
    /**
     * Clear context storage
     */
    clear: () => void;
    /**
     * find first request context matching specified url and request type
     */
    find: (requestUrl: string, requestType: RequestType) => RequestContext | undefined;
    onRecord: EventChannelInterface<RequestStorageEvent>;
    onUpdate: EventChannelInterface<RequestStorageEvent>;
}
export declare class RequestContextStorage implements RequestContextStorageInterface {
    protected contextStorage: Map<string, RequestContext>;
    onRecord: EventChannel<RequestStorageEvent>;
    onUpdate: EventChannel<RequestStorageEvent>;
    get(requestId: string): RequestContext | undefined;
    record(requestId: string, data: RequestContext): RequestContext;
    update(requestId: string, data: Partial<RequestContext>): RequestContext | undefined;
    delete(requestId: string): void;
    find(requestUrl: string, requestType: RequestType): RequestContext | undefined;
    clear(): void;
}
export declare const requestContextStorage: RequestContextStorage;
