import { CosmeticRule } from '@adguard/tsurlfilter';
import { HtmlRuleAttributes } from './html-rule-attributes';
/**
 * Encapsulates html rule attributes parsing
 */
export declare class HtmlRuleParser {
    private static ATTRIBUTE_START_MARK;
    private static ATTRIBUTE_END_MARK;
    private static QUOTES;
    private static TAG_CONTENT_MASK;
    private static WILDCARD_MASK;
    private static TAG_CONTENT_MAX_LENGTH;
    private static TAG_CONTENT_MIN_LENGTH;
    private static PARENT_ELEMENTS;
    private static PARENT_SEARCH_LEVEL;
    private static DEFAULT_PARENT_SEARCH_LEVEL;
    private static DEFAULT_MAX_LENGTH;
    /**
     * Parses html rule
     *
     * @param rule
     */
    static parse(rule: CosmeticRule): HtmlRuleAttributes;
    /**
     * Looks up next closing quotation
     * Skips double quotes in text like:
     * [tag-content="teas""ernet"]
     *
     * @param text
     * @param startIndex
     * @return {number}
     */
    private static getClosingQuoteIndex;
}
