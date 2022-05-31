import { NetworkRule, CosmeticRule } from '@adguard/tsurlfilter';
import { EventChannel } from './utils';
export declare const enum FilteringEventType {
    COOKIE = "COOKIE",
    REMOVE_HEADER = "REMOVE_HEADER",
    REMOVE_PARAM = "REMOVE_PARAM",
    HTTP_RULE_APPLY = "HTTP_RULE_APPLY",
    REPLACE_RULE_APPLY = "REPLACE_RULE_APPLY",
    CONTENT_FILTERING_START = "CONTENT_FILTERING_START",
    CONTENT_FILTERING_FINISH = "CONTENT_FILTERING_FINISH",
    STEALTH_ACTION = "STEALTH_ACTION"
}
export declare type CookieEventData = {
    tabId: number;
    cookieName: string;
    cookieValue: string;
    cookieDomain: string;
    cookieRule: NetworkRule;
    isModifyingCookieRule: boolean;
    thirdParty: boolean;
    timestamp: number;
};
export declare type CookieEvent = {
    type: FilteringEventType.COOKIE;
    data: CookieEventData;
};
export declare type RemoveHeaderEventData = {
    tabId: number;
    frameUrl: string;
    headerName: string;
    rule: NetworkRule;
};
export declare type RemoveHeaderEvent = {
    type: FilteringEventType.REMOVE_HEADER;
    data: RemoveHeaderEventData;
};
export declare type RemoveParamEventData = {
    tabId: number;
    frameUrl: string;
    paramName: string;
    rule: NetworkRule;
};
export declare type RemoveParamEvent = {
    type: FilteringEventType.REMOVE_PARAM;
    data: RemoveParamEventData;
};
export declare type HttpRuleApplyEventData = {
    tabId: number;
    requestId: string;
    elementString: string;
    frameUrl: string;
    rule: CosmeticRule;
};
export declare type HttpRuleApplyEvent = {
    type: FilteringEventType.HTTP_RULE_APPLY;
    data: HttpRuleApplyEventData;
};
export declare type ReplaceRuleApplyEventData = {
    tabId: number;
    requestId: string;
    frameUrl: string;
    rules: NetworkRule[];
};
export declare type ReplaceRuleApplyEvent = {
    type: FilteringEventType.REPLACE_RULE_APPLY;
    data: ReplaceRuleApplyEventData;
};
export declare type ContentFilteringStartEventData = {
    requestId: string;
};
export declare type ContentFilteringStartEvent = {
    type: FilteringEventType.CONTENT_FILTERING_START;
    data: ContentFilteringStartEventData;
};
export declare type ContentFilteringFinishEventData = {
    requestId: string;
};
export declare type ContentFilteringFinishEvent = {
    type: FilteringEventType.CONTENT_FILTERING_FINISH;
    data: ContentFilteringFinishEventData;
};
export declare type StealthActionEventData = {
    tabId: number;
    requestId: string;
    /**
     * Applied actions mask
     */
    actions: number;
};
export declare type StealthActionEvent = {
    type: FilteringEventType.STEALTH_ACTION;
    data: StealthActionEventData;
};
export declare type FilteringLogEvent = CookieEvent | RemoveHeaderEvent | RemoveParamEvent | HttpRuleApplyEvent | ReplaceRuleApplyEvent | ContentFilteringStartEvent | ContentFilteringFinishEvent | StealthActionEvent;
export interface FilteringLogInterface {
    /**
     * Add cookie rule event
     */
    addCookieEvent(data: CookieEventData): void;
    /**
     * Add header removed event
     */
    addRemoveHeaderEvent(data: RemoveHeaderEventData): void;
    /**
     * Add param removed event
     */
    addRemoveParamEvent(data: RemoveParamEventData): void;
    /**
     * Add html rule apply event
     */
    addHtmlRuleApplyEvent(data: HttpRuleApplyEventData): void;
    /**
     * Add replace rule apply event
     */
    addReplaceRuleApplyEvent(data: ReplaceRuleApplyEventData): void;
    /**
     * Add content filter working start event
     */
    addContentFilteringStartEvent(data: ContentFilteringStartEventData): void;
    /**
     * Add content filter working finish event
     */
    addContentFilteringFinishEvent(data: ContentFilteringFinishEventData): void;
    /**
     * Add stealth action event
     */
    addStealthActionEvent(data: StealthActionEventData): void;
}
export declare class FilteringLog implements FilteringLogInterface {
    onLogEvent: EventChannel<FilteringLogEvent>;
    addCookieEvent(data: CookieEventData): void;
    addRemoveHeaderEvent(data: RemoveHeaderEventData): void;
    addRemoveParamEvent(data: RemoveParamEventData): void;
    addHtmlRuleApplyEvent(data: HttpRuleApplyEventData): void;
    addReplaceRuleApplyEvent(data: ReplaceRuleApplyEventData): void;
    addContentFilteringStartEvent(data: ContentFilteringStartEventData): void;
    addContentFilteringFinishEvent(data: ContentFilteringFinishEventData): void;
    addStealthActionEvent(data: StealthActionEventData): void;
}
export declare const defaultFilteringLog: FilteringLog;
