import { RequestType } from '@adguard/tsurlfilter';
import { RequestContext } from '../request';
export interface FrameRequestServiceSearchParams {
    tabId: number;
    frameId: number;
    requestUrl: string;
    requestType: RequestType;
}
export declare class FrameRequestService {
    static start(): void;
    static stop(): void;
    private static recordFrameRequestContext;
    private static updateFrameRequestContext;
    /**
     * Find request context in existing frames
     */
    static search({ tabId, frameId, requestUrl, requestType, }: FrameRequestServiceSearchParams): RequestContext | undefined;
    /**
     * Prepare search data, taking into account the fact
     * that the iframe may not have its own source url
     */
    static prepareSearchParams(requestUrl: string, tabId: number, frameId: number): FrameRequestServiceSearchParams;
}
