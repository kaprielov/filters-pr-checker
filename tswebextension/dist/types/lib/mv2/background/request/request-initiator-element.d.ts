import { RequestType } from '@adguard/tsurlfilter';
/**
 * Some html tags can trigger network requests.
 * If request is blocked by network rule, we try to collapse broken element from backgound page
 */
export declare const enum InitiatorTag {
    FRAME = "frame",
    IFRAME = "iframe",
    IMAGE = "img"
}
export declare const BACKGROUND_TAB_ID = -1;
/**
 * Css, injected to broken element for hiding
 */
export declare const INITIATOR_TAG_HIDDEN_STYLE = "{ display: none!important; visibility: hidden!important; height: 0px!important; min-height: 0px!important; }";
/**
 * Inject css for element hiding by tabs.injectCss
 */
export declare function hideRequestInitiatorElement(tabId: number, requestFrameId: number, url: string, requestType: RequestType, isThirdParty: boolean): void;
