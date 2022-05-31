import { RequestContext } from '../request';
/**
 * Content Security Policy Headers filtering service module
 */
export declare class CspService {
    /**
     * On headers received handler.
     * Add CSP headers.
     *
     * @param context request context
     * @return if headers modified
     */
    static onHeadersReceived(context: RequestContext): boolean;
}
