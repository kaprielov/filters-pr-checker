import { IAffectedElement } from 'extended-css';
/**
 * Counted element interface
 */
interface ICountedElement {
    filterId: number;
    ruleText: string;
    element: string;
}
/**
 * Class represents collecting css style hits process
 *
 * During applying css styles to element we add special 'content:' attribute
 * Example:
 * .selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}
 *
 * then here we parse this attribute and calls provided callback function
 */
export declare class CssHitsCounter {
    /**
     * We split CSS hits counting into smaller batches of elements
     * and schedule them one by one using setTimeout
     */
    private static readonly COUNT_CSS_HITS_BATCH_DELAY;
    /**
     * Size of small batches of elements we count
     */
    private static readonly CSS_HITS_BATCH_SIZE;
    /**
     * In order to find elements hidden by AdGuard we look for a `:content` pseudo-class
     * with values starting with this prefix. Filter information will be
     * encoded in this value as well.
     */
    private static readonly CONTENT_ATTR_PREFIX;
    /**
     * We delay countAllCssHits function if it was called too frequently from mutationObserver
     */
    private static readonly COUNT_ALL_CSS_HITS_TIMEOUT_MS;
    /**
     * Callback function for counted css hits handling
     */
    private onCssHitsFoundCallback;
    /**
     * Hits storage
     */
    private hitsStorage;
    /**
     * Mutation observer
     */
    private observer;
    /**
     * Counting on process flag
     */
    private countIsWorking;
    /**
     * This function prepares calculation of css hits.
     * We are waiting for 'load' event and start calculation.
     * @param callback - ({filterId: number; ruleText: string; element: string}[]) => {} handles counted css hits
     */
    constructor(callback: (x: ICountedElement[]) => void);
    /**
     * Stops css hits counting process
     */
    stop(): void;
    /**
     * Callback used to collect statistics of elements affected by extended css rules
     *
     * @param {object} affectedEl
     * @return {object} affectedEl
     */
    countAffectedByExtendedCss(affectedEl: IAffectedElement): IAffectedElement;
    /**
     * Starts counting process
     */
    private startCounter;
    /**
     * Counts css hits
     */
    private countCssHits;
    /**
     * Counts css hits for already affected elements
     */
    private countAllCssHits;
    /**
     * Main calculation function.
     * 1. Selects sub collection from elements.
     * 2. For each element from sub collection: retrieves calculated css 'content'
     * attribute and if it contains 'adguard'
     * marker then retrieves rule text and filter identifier.
     * 3. Starts next task with some delay.
     *
     * @param elements Collection of all elements
     * @param start Start of batch
     * @param end End of batch
     * @param step Size of batch
     * @param result Collection for save result
     * @param callback Finish callback
     */
    private countCssHitsBatch;
    /**
     * Counts css hits for array of elements
     *
     * @param elements
     * @param start
     * @param length
     */
    private countCssHitsForElements;
    /**
     * Counts css hits for mutations
     */
    private countCssHitsForMutations;
    /**
     * Starts mutation observer
     */
    private startObserver;
    /**
     * Function checks if elements style content attribute contains data injected with AdGuard
     *
     * @param {Node} element
     * @returns {({filterId: Number, ruleText: String} | null)}
     */
    private static getCssHitData;
    /**
     * Check if tag is ignored
     * @param nodeTag
     */
    private static isIgnoredNodeTag;
}
export {};
