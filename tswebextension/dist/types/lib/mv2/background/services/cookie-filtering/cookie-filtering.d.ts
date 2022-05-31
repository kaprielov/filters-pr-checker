import { NetworkRule } from '@adguard/tsurlfilter';
import { FilteringLog } from '../../../../common';
import { RequestContext } from '../../request';
/**
 * Cookie filtering
 *
 * The following public methods should be set as suitable webrequest events listeners,
 * check sample extension in this repo for an example
 *
 * Logic introduction:
 *
 * onBeforeSendHeaders:
 * - get all cookies for request url
 * - store cookies (first-party)
 *
 * onHeadersReceived:
 * - parse set-cookie header, only to detect if the cookie in header will be set from third-party request
 * - save third-party flag for this cookie cookie.thirdParty=request.thirdParty
 * - apply rules via removing them from headers and removing them with browser.cookies api
 * TODO Rewrite/split method for extensions on MV3, because we wont have possibility to remove rules via headers
 *
 * onCompleted
 * - apply rules via content script
 * In content-scripts (check /src/content-script/cookie-controller.ts):
 * - get matching cookie rules
 * - apply
 */
export declare class CookieFiltering {
    private filteringLog;
    private browserCookieApi;
    /**
     * Constructor
     *
     * @param filteringLog
     */
    constructor(filteringLog: FilteringLog);
    /**
     * Parses cookies from headers
     * @param context
     */
    onBeforeSendHeaders(context: RequestContext): void;
    /**
     * Applies cookies to headers
     * @param context
     * @private
     */
    private applyRulesToCookieHeaders;
    /**
     * Parses set-cookie header
     * looks up third-party cookies
     * This callback won't work for mv3 extensions
     * TODO separate or rewrite to mv2 and mv3 methods
     *
     * @param context
     */
    onHeadersReceived(context: RequestContext): boolean;
    /**
     * Looks up blocking rules for content-script in frame context
     */
    getBlockingRules(frameUrl: string, tabId: number, frameId: number): NetworkRule[];
    /**
     * Applies rules
     * @param context
     */
    private applyRules;
    /**
     * Applies rules to cookie
     *
     * @param cookie
     * @param cookieRules
     * @param tabId
     */
    private applyRulesToCookie;
    /**
     * Modifies instance of BrowserCookie with provided rules
     *
     * @param cookie Cookie modify
     * @param rules Cookie matching rules
     * @return applied rules
     *
     */
    private static applyRuleToBrowserCookie;
}
export declare const cookieFiltering: CookieFiltering;
