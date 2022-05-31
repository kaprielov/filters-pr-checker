import { RequestType } from '@adguard/tsurlfilter';
import { WebRequest } from 'webextension-polyfill';
/**
 * TODO: move contentType to frontend or delete?
 */
export declare const enum ContentType {
    DOCUMENT = "DOCUMENT",
    SUBDOCUMENT = "SUBDOCUMENT",
    SCRIPT = "SCRIPT",
    STYLESHEET = "STYLESHEET",
    OBJECT = "OBJECT",
    IMAGE = "IMAGE",
    XMLHTTPREQUEST = "XMLHTTPREQUEST",
    MEDIA = "MEDIA",
    FONT = "FONT",
    WEBSOCKET = "WEBSOCKET",
    WEBRTC = "WEBRTC",
    OTHER = "OTHER",
    CSP = "CSP",
    COOKIE = "COOKIE",
    PING = "PING",
    CSP_REPORT = "CSP_REPORT"
}
export interface RequestTypeData {
    contentType: ContentType;
    requestType: RequestType;
}
export declare function getRequestType(resourceType: WebRequest.ResourceType): RequestTypeData;
