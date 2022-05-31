import { WebRequest } from 'webextension-polyfill';
import { RequestType, NetworkRule } from '@adguard/tsurlfilter';
export declare type WebRequestBlockingResponse = WebRequest.BlockingResponse | void;
export declare class RequestBlockingApi {
    static processShouldCollapse(tabId: number, url: string, referrerUrl: string, requestType: RequestType): boolean;
    static isRequestBlockedByRule(requestRule: NetworkRule | null): boolean;
    static isDocumentBlockingRule(requestRule: NetworkRule | null): boolean;
    static getBlockedResponseByRule(requestRule: NetworkRule | null, requestType: RequestType): WebRequestBlockingResponse;
}
