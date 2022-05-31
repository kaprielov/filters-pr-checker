import { CosmeticRule } from '@adguard/tsurlfilter';
export declare class CosmeticApi {
    /**
     * Builds stylesheet from rules
     */
    static buildStyleSheet(elemhideRules: CosmeticRule[], injectRules: CosmeticRule[], groupElemhideSelectors: boolean): string[];
}
