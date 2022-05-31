import { FilteringLog } from '../../../common';
import { RequestContext } from '../request';
/**
 * Headers filtering service module
 */
export declare class HeadersService {
    private filteringLog;
    /**
     * Constructor
     *
     * @param filteringLog
     */
    constructor(filteringLog: FilteringLog);
    /**
     * On before send headers handler.
     * Removes request headers.
     *
     * @param context request context
     * @return if headers modified
     */
    onBeforeSendHeaders(context: RequestContext): boolean;
    /**
     * On headers received handler.
     * Remove response headers.
     *
     * @param context request context
     * @return if headers modified
     */
    onHeadersReceived(context: RequestContext): boolean;
    /**
     * Applies rule to headers
     *
     * @param headers
     * @param rule
     * @param isRequestHeaders
     */
    private static applyRule;
}
export declare const headersService: HeadersService;
