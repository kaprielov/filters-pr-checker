import { NetworkRule, CosmeticRule } from '@adguard/tsurlfilter';
import { FilteringLog } from '../../../../common';
import { RequestContext } from '../../request';
export interface ContentStringFilterInterface {
    /**
     * Applies Html and Replace rules to content string.
     */
    applyRules: (content: string) => string;
}
export declare class ContentStringFilter implements ContentStringFilterInterface {
    context: RequestContext;
    htmlRules: CosmeticRule[] | null;
    replaceRules: NetworkRule[] | null;
    filteringLog: FilteringLog;
    constructor(context: RequestContext, htmlRules: CosmeticRule[] | null, replaceRules: NetworkRule[] | null, filteringLog: FilteringLog);
    applyRules(content: string): string;
    private applyHtmlRules;
    private applyReplaceRules;
}
