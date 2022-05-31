/**
 * If referrer of request contains full url of extension,
 * then this request is considered as extension's own request
 * (e.g. request for filter downloading)
 * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1437
 */
export declare const isOwnUrl: (referrerUrl: string) => boolean;
export declare const isHttpOrWsRequest: (url: string) => boolean;
export declare const getDomain: (url: string) => string | undefined;
/**
 * Checks third party relation
 *
 * @param requestUrl
 * @param referrer
 */
export declare function isThirdPartyRequest(requestUrl: string, referrer: string): boolean;
