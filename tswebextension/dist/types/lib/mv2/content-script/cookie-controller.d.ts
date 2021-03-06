/**
 * This class applies cookie rules in page context
 *
 * - Removes cookies matching rules
 * - Listens to new cookies, then tries to apply rules to them
 */
export declare class CookieController {
    /**
     * On rule applied callback
     */
    private readonly onRuleAppliedCallback;
    /**
     * Is current context third-party
     */
    private readonly isThirdPartyContext;
    /**
     * Constructor
     *
     * @param callback
     */
    constructor(callback: (data: {
        cookieName: string;
        cookieValue: string;
        cookieDomain: string;
        cookieRuleText: string;
        thirdParty: boolean;
        filterId: number;
    }) => void);
    /**
     * Applies rules
     *
     * @param rules
     */
    apply(rules: {
        ruleText: string;
        match: string;
        isThirdParty: boolean;
        filterId: number;
        isAllowlist: boolean;
    }[]): void;
    /**
     * Polling document cookie
     *
     * @param callback
     * @param interval
     */
    private listenCookieChange;
    /**
     * Checks if current context is third-party
     */
    private isThirdPartyFrame;
    /**
     * Applies rules to document cookies
     * Inspired by remove-cookie scriptlet
     * https://github.com/AdguardTeam/Scriptlets/blob/master/src/scriptlets/remove-cookie.js
     *
     * @param rules
     */
    private applyRules;
    /**
     * Applies rule
     *
     * @param rule
     * @param cookieName
     * @param cookieValue
     */
    private applyRule;
    /**
     * Removes cookie for host
     *
     * @param cookieName
     * @param hostName
     */
    private static removeCookieFromHost;
    /**
     * Converts cookie rule match to regular expression
     *
     * @param str
     */
    private static toRegExp;
}
