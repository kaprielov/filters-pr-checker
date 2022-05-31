/**
 * Content filtering module
 * Handles Html filtering and replace rules
 */
export declare class ContentFiltering {
    /**
     * Contains collection of supported request types for replace rules
     */
    private static supportedReplaceRulesRequestTypes;
    private static getHtmlRules;
    private static getReplaceRules;
    static onBeforeRequest(requestId: string): void;
}
