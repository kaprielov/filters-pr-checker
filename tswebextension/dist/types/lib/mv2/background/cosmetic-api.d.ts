import { CosmeticResult } from '@adguard/tsurlfilter';
export declare class CosmeticApi {
    private static ELEMHIDE_HIT_START;
    private static INJECT_HIT_START;
    private static HIT_SEP;
    private static HIT_END;
    /**
     * Applies scripts from cosmetic result
     */
    static injectScript(scriptText: string, tabId: number, frameId?: number): void;
    /**
     * Applies css from cosmetic result
     *
     * Patches rule selector adding adguard mark rule info in the content attribute
     * Example:
     * .selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}
     */
    static injectCss(cssText: string, tabId: number, frameId?: number): void;
    static injectExtCss(extCssText: string, tabId: number, frameId?: number): void;
    static getCssText(cosmeticResult: CosmeticResult, collectingCosmeticRulesHits?: boolean): string | undefined;
    static getExtCssText(cosmeticResult: CosmeticResult, collectingCosmeticRulesHits?: boolean): string | undefined;
    static getScriptText(cosmeticResult: CosmeticResult): string | undefined;
    static getFrameExtCssText(frameUrl: string, tabId: number, frameId: number): string | undefined;
    /**
     * Builds stylesheet from rules
     */
    private static buildStyleSheet;
    /**
     * Urlencodes rule text.
     *
     * @param ruleText
     * @return {string}
     */
    private static escapeRule;
    /**
     * Patch rule selector adding adguard mark rule info in the content attribute
     * Example:
     * .selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}
     */
    private static addMarkerToElemhideRule;
    /**
     * Patch rule selector adding adguard mark and rule info in the content attribute
     * Example:
     * .selector { color: red } -> .selector { color: red, content: 'adguard{filterId};{ruleText} !important;}
     */
    private static addMarkerToInjectRule;
    /**
     * Builds stylesheet with css-hits marker
     */
    private static buildStyleSheetWithHits;
}
