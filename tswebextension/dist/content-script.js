import ExtendedCss from 'extended-css';
import { RequestType } from '@adguard/tsurlfilter';
import { z } from 'zod';
import browser from 'webextension-polyfill';
import { adguardAssistant } from '@adguard/assistant';

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * Utils class
 */
class ElementUtils {
    /**
     * Serialize HTML element
     *
     * @param element
     */
    static elementToString(element) {
        const s = [];
        s.push('<');
        s.push(element.localName);
        const { attributes } = element;
        for (let i = 0; i < attributes.length; i += 1) {
            const attr = attributes[i];
            s.push(' ');
            s.push(attr.name);
            s.push('="');
            const value = attr.value === null ? '' : attr.value.replace(/"/g, '\\"');
            s.push(value);
            s.push('"');
        }
        s.push('>');
        return s.join('');
    }
    /**
     * Appends node children to the array
     *
     * @param node - element whose children we would like to add
     * @param arrayWithNodes - array where we add children
     */
    static appendChildren(node, arrayWithNodes) {
        const children = node.querySelectorAll('*');
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i += 1) {
                arrayWithNodes.push(children[i]);
            }
        }
    }
    /**
     * Adds elements into array if they are not in the array yet
     *
     * @param {*} targetArray
     * @param {*} sourceArray
     */
    static addUnique(targetArray, sourceArray) {
        if (sourceArray.length > 0) {
            for (let i = 0; i < sourceArray.length; i += 1) {
                const sourceElement = sourceArray[i];
                if (targetArray.indexOf(sourceElement) === -1) {
                    targetArray.push(sourceElement);
                }
            }
        }
    }
    /**
     * Removes all elements in array
     *
     * @param elements
     */
    static removeElements(elements) {
        for (let i = 0; i < elements.length; i += 1) {
            const element = elements[i];
            element.remove();
        }
    }
    /**
     * Parses hits info from style content
     *
     * @param content style
     * @param attributeMarker
     */
    static parseInfo(content, attributeMarker) {
        if (!content || content.indexOf(attributeMarker) < 0) {
            return null;
        }
        let filterIdAndRuleText = decodeURIComponent(content);
        // 'content' value may include open and close quotes.
        filterIdAndRuleText = ElementUtils.removeQuotes(filterIdAndRuleText);
        // Remove prefix
        filterIdAndRuleText = filterIdAndRuleText.substring(attributeMarker.length);
        // Attribute 'content' in css looks like: {content: 'adguard{filterId};{ruleText}'}
        const index = filterIdAndRuleText.indexOf(';');
        if (index < 0) {
            return null;
        }
        const filterId = parseInt(filterIdAndRuleText.substring(0, index), 10);
        if (Number.isNaN(filterId)) {
            return null;
        }
        const ruleText = filterIdAndRuleText.substring(index + 1);
        return { filterId, ruleText };
    }
    /**
     * Parses hits info from style content
     *
     * @param content style
     * @param attributeMarker
     */
    // eslint-disable-next-line max-len
    static parseExtendedStyleInfo(content, attributeMarker) {
        const important = '!important';
        const indexOfImportant = content.lastIndexOf(important);
        if (indexOfImportant === -1) {
            return ElementUtils.parseInfo(content, attributeMarker);
        }
        const contentWithoutImportant = content.substring(0, indexOfImportant).trim();
        return ElementUtils.parseInfo(contentWithoutImportant, attributeMarker);
    }
    /**
     * Unquotes specified value
     */
    static removeQuotes(value) {
        if (value.length > 1
            && ((value[0] === '"' && value[value.length - 1] === '"')
                || (value[0] === '\'' && value[value.length - 1] === '\''))) {
            // Remove double-quotes or single-quotes
            return value.substring(1, value.length - 1);
        }
        return value;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This storage is used to keep track of counted rules
 * regarding to node elements
 */
class HitsStorage {
    constructor() {
        /**
         * Start count number
         */
        this.counter = 0;
        /**
         * Storage random identificator
         */
        this.randomKey = HitsStorage.generateRandomKey();
        /**
         * Map storage
         */
        this.map = new Map();
    }
    /**
     * Checks if element is counted
     *
     * @param element html element
     * @param rule rule text
     */
    isCounted(element, rule) {
        const hitAddress = element[this.randomKey];
        if (hitAddress) {
            const countedHit = this.map.get(hitAddress);
            if (countedHit) {
                return countedHit.element === element && countedHit.rule === rule;
            }
        }
        return false;
    }
    /**
     * Stores rule-element info in storage
     *
     * @param element html element
     * @param rule rule text
     */
    setCounted(element, rule) {
        const counter = this.getCounter();
        // eslint-disable-next-line no-param-reassign
        element[this.randomKey] = counter;
        this.map.set(counter, { element, rule });
    }
    /**
     * @return current count number
     */
    getCounter() {
        this.counter += 1;
        return this.counter;
    }
    /**
     * Random id generator
     * @returns {String} - random key with desired length
     */
    static generateRandomKey() {
        const keyLength = 10;
        const possibleValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < keyLength; i += 1) {
            result += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
        }
        return result;
    }
}

/* eslint-disable no-param-reassign */
/**
 * Class represents collecting css style hits process
 *
 * During applying css styles to element we add special 'content:' attribute
 * Example:
 * .selector -> .selector { content: 'adguard{filterId};{ruleText} !important;}
 *
 * then here we parse this attribute and calls provided callback function
 */
class CssHitsCounter {
    /**
     * This function prepares calculation of css hits.
     * We are waiting for 'load' event and start calculation.
     * @param callback - ({filterId: number; ruleText: string; element: string}[]) => {} handles counted css hits
     */
    constructor(callback) {
        /**
         * Hits storage
         */
        this.hitsStorage = new HitsStorage();
        /**
         * Mutation observer
         */
        this.observer = null;
        /**
         * Counting on process flag
         */
        this.countIsWorking = false;
        this.onCssHitsFoundCallback = callback;
        if (document.readyState === 'complete'
            || document.readyState === 'interactive') {
            this.countCssHits();
        }
        else {
            document.addEventListener('readystatechange', this.startCounter.bind(this));
        }
    }
    /**
     * Stops css hits counting process
     */
    stop() {
        this.onCssHitsFoundCallback = () => { };
        if (this.observer) {
            this.observer.disconnect();
        }
    }
    /**
     * Callback used to collect statistics of elements affected by extended css rules
     *
     * @param {object} affectedEl
     * @return {object} affectedEl
     */
    countAffectedByExtendedCss(affectedEl) {
        if (affectedEl && affectedEl.rules && affectedEl.rules.length > 0) {
            const result = [];
            for (const rule of affectedEl.rules) {
                if (rule.style && rule.style.content) {
                    const styleInfo = ElementUtils.parseExtendedStyleInfo(rule.style.content, CssHitsCounter.CONTENT_ATTR_PREFIX);
                    if (styleInfo === null) {
                        continue;
                    }
                    const { filterId, ruleText } = styleInfo;
                    if (filterId !== undefined && ruleText !== undefined) {
                        result.push({
                            filterId,
                            ruleText,
                            element: ElementUtils.elementToString(affectedEl.node),
                        });
                        // clear style content to avoid duplicate counting
                        rule.style.content = '';
                    }
                }
            }
            this.onCssHitsFoundCallback(result);
        }
        return affectedEl;
    }
    /**
     * Starts counting process
     */
    startCounter() {
        if (document.readyState === 'interactive'
            || document.readyState === 'complete') {
            this.countCssHits();
            document.removeEventListener('readystatechange', this.startCounter);
        }
    }
    /**
     * Counts css hits
     */
    countCssHits() {
        this.countAllCssHits();
        this.countCssHitsForMutations();
    }
    /**
     * Counts css hits for already affected elements
     */
    countAllCssHits() {
        // we don't start counting again all css hits till previous count process wasn't finished
        if (this.countIsWorking) {
            return;
        }
        this.countIsWorking = true;
        const elements = document.querySelectorAll('*');
        this.countCssHitsBatch(elements, 0, CssHitsCounter.CSS_HITS_BATCH_SIZE, CssHitsCounter.CSS_HITS_BATCH_SIZE, [], (result) => {
            if (result.length > 0) {
                this.onCssHitsFoundCallback(result);
            }
            this.countIsWorking = false;
        });
    }
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
    // eslint-disable-next-line max-len
    countCssHitsBatch(elements, start, end, step, result, callback) {
        const length = Math.min(end, elements.length);
        result = result.concat(this.countCssHitsForElements(elements, start, length));
        if (length === elements.length) {
            callback(result);
            return;
        }
        start = end;
        end += step;
        // Start next task with some delay
        window.setTimeout(() => {
            this.countCssHitsBatch(elements, start, end, step, result, callback);
        }, CssHitsCounter.COUNT_CSS_HITS_BATCH_DELAY);
    }
    /**
     * Counts css hits for array of elements
     *
     * @param elements
     * @param start
     * @param length
     */
    countCssHitsForElements(elements, start, length) {
        const RULE_FILTER_SEPARATOR = ';';
        start = start || 0;
        length = length || elements.length;
        const result = [];
        for (let i = start; i < length; i += 1) {
            const element = elements[i];
            const cssHitData = CssHitsCounter.getCssHitData(element);
            if (!cssHitData) {
                continue;
            }
            const { filterId, ruleText } = cssHitData;
            const ruleAndFilterString = filterId + RULE_FILTER_SEPARATOR + ruleText;
            if (this.hitsStorage.isCounted(element, ruleAndFilterString)) {
                continue;
            }
            this.hitsStorage.setCounted(element, ruleAndFilterString);
            result.push({
                filterId,
                ruleText,
                element: ElementUtils.elementToString(element),
            });
        }
        return result;
    }
    /**
     * Counts css hits for mutations
     */
    countCssHitsForMutations() {
        // eslint-disable-next-line prefer-destructuring
        const MutationObserver = window.MutationObserver;
        if (!MutationObserver) {
            return;
        }
        if (this.observer) {
            this.observer.disconnect();
        }
        let timeoutId = null;
        this.observer = new MutationObserver(((mutationRecords) => {
            // Collect probe elements, count them, then remove from their targets
            const probeElements = [];
            const childrenOfProbeElements = [];
            const potentialProbeElements = [];
            mutationRecords.forEach((mutationRecord) => {
                if (mutationRecord.addedNodes.length === 0) {
                    return;
                }
                for (let i = 0; i < mutationRecord.addedNodes.length; i += 1) {
                    const node = mutationRecord.addedNodes[i];
                    if (!(node instanceof Element) || CssHitsCounter.isIgnoredNodeTag(node.tagName)) {
                        continue;
                    }
                    const { target } = mutationRecord;
                    if (!node.parentNode && target) {
                        // Most likely this is a "probe" element that was added and then
                        // immediately removed from DOM.
                        // We re-add it and check if any rule matched it
                        probeElements.push(node);
                        // CSS rules could be applied to the nodes inside probe element
                        // that's why we get all child elements of added node
                        ElementUtils.appendChildren(node, childrenOfProbeElements);
                        if (this.observer) {
                            this.observer.disconnect();
                        }
                        mutationRecord.target.appendChild(node);
                    }
                    else if (node.parentNode && target) {
                        // Sometimes probe elements are appended to the DOM
                        potentialProbeElements.push(node);
                        ElementUtils.appendChildren(node, potentialProbeElements);
                    }
                }
            });
            // If the list of potential probe elements is relatively small,
            // we can count CSS hits immediately
            if (potentialProbeElements.length > 0
                && potentialProbeElements.length <= CssHitsCounter.CSS_HITS_BATCH_SIZE) {
                const result = this.countCssHitsForElements(potentialProbeElements, 0, null);
                if (result.length > 0) {
                    this.onCssHitsFoundCallback(result);
                }
            }
            const allProbeElements = [];
            ElementUtils.addUnique(allProbeElements, childrenOfProbeElements);
            ElementUtils.addUnique(allProbeElements, probeElements);
            if (allProbeElements.length > 0) {
                const result = this.countCssHitsForElements(allProbeElements, 0, null);
                if (result.length > 0) {
                    this.onCssHitsFoundCallback(result);
                }
                /**
                 * don't remove child elements of probe elements
                 * https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1096
                 */
                ElementUtils.removeElements(probeElements);
                this.startObserver();
            }
            // debounce counting all css hits when mutation record fires
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(() => {
                this.countAllCssHits();
                window.clearTimeout(timeoutId);
            }, CssHitsCounter.COUNT_ALL_CSS_HITS_TIMEOUT_MS);
        }));
        this.startObserver();
    }
    /**
     * Starts mutation observer
     */
    startObserver() {
        if (this.observer) {
            this.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }
    }
    /**
     * Function checks if elements style content attribute contains data injected with AdGuard
     *
     * @param {Node} element
     * @returns {({filterId: Number, ruleText: String} | null)}
     */
    static getCssHitData(element) {
        const style = getComputedStyle(element);
        return ElementUtils.parseInfo(style.content, CssHitsCounter.CONTENT_ATTR_PREFIX);
    }
    /**
     * Check if tag is ignored
     * @param nodeTag
     */
    static isIgnoredNodeTag(nodeTag) {
        const ignoredTags = ['script'];
        return ignoredTags.includes(nodeTag.toLowerCase());
    }
}
/**
 * We split CSS hits counting into smaller batches of elements
 * and schedule them one by one using setTimeout
 */
CssHitsCounter.COUNT_CSS_HITS_BATCH_DELAY = 5;
/**
 * Size of small batches of elements we count
 */
CssHitsCounter.CSS_HITS_BATCH_SIZE = 25;
/**
 * In order to find elements hidden by AdGuard we look for a `:content` pseudo-class
 * with values starting with this prefix. Filter information will be
 * encoded in this value as well.
 */
CssHitsCounter.CONTENT_ATTR_PREFIX = 'adguard';
/**
 * We delay countAllCssHits function if it was called too frequently from mutationObserver
 */
CssHitsCounter.COUNT_ALL_CSS_HITS_TIMEOUT_MS = 500;

z.object({
    /**
     * Specifies filter lists that will be used to filter content.
     * filterId should uniquely identify the filter so that the API user
     * may match it with the source lists in the filtering log callbacks.
     * content is a string with the full filter list content. The API will
     * parse it into a list of individual rules.
     */
    filters: z.object({
        filterId: z.number(),
        content: z.string(),
    }).array(),
    /**
     * List of domain names of sites, which should be excluded from blocking
     * or which should be included in blocking depending on the value of
     * allowlistInverted setting value
     */
    allowlist: z.string().array(),
    /**
     * List of rules added by user
     */
    userrules: z.string().array(),
    /**
     * Flag responsible for logging
     */
    verbose: z.boolean(),
    settings: z.object({
        /**
         * Flag specifying if ads for sites would be blocked or allowed
         */
        allowlistInverted: z.boolean(),
        /**
         * Enables css hits counter if true
         */
        collectStats: z.boolean(),
        stealth: z.object({
            blockChromeClientData: z.boolean(),
            hideReferrer: z.boolean(),
            hideSearchQueries: z.boolean(),
            sendDoNotTrack: z.boolean(),
            blockWebRTC: z.boolean(),
            selfDestructThirdPartyCookies: z.boolean(),
            selfDestructThirdPartyCookiesTime: z.number(),
            selfDestructFirstPartyCookies: z.boolean(),
            selfDestructFirstPartyCookiesTime: z.number(),
        }),
    }),
}).strict();

const MESSAGE_HANDLER_NAME = 'tsWebExtension';
var MessageType;
(function (MessageType) {
    MessageType["PROCESS_SHOULD_COLLAPSE"] = "PROCESS_SHOULD_COLLAPSE";
    MessageType["GET_EXTENDED_CSS"] = "GET_EXTENDED_CSS";
    MessageType["GET_CSS"] = "GET_CSS";
    MessageType["GET_COOKIE_RULES"] = "GET_COOKIE_RULES";
    MessageType["SAVE_COOKIE_LOG_EVENT"] = "SAVE_COOKIE_LOG_EVENT";
    MessageType["INIT_ASSISTANT"] = "INIT_ASSISTANT";
    MessageType["CLOSE_ASSISTANT"] = "CLOSE_ASSISTANT";
    MessageType["ASSISTANT_CREATE_RULE"] = "ASSISTANT_CREATE_RULE";
})(MessageType || (MessageType = {}));
z.object({
    handlerName: z.literal(MESSAGE_HANDLER_NAME),
    type: z.nativeEnum(MessageType),
    payload: z.unknown(),
}).strict();
z.object({
    elementUrl: z.string(),
    documentUrl: z.string(),
    requestType: z.nativeEnum(RequestType),
}).strict();
z.object({
    documentUrl: z.string(),
}).strict();
z.object({
    url: z.string(),
}).strict();
z.object({
    documentUrl: z.string(),
}).strict();
z.object({
    cookieName: z.string(),
    cookieDomain: z.string(),
    cookieValue: z.string(),
    ruleText: z.string(),
    filterId: z.number(),
    thirdParty: z.boolean(),
}).strict();
z.object({
    ruleText: z.string(),
}).strict();

/**
 * This module applies stealth actions in page context
 */
class StealthHelper {
    /**
     * Sends a Global Privacy Control DOM signal
     */
    static setDomSignal() {
        try {
            if ('globalPrivacyControl' in Navigator.prototype) {
                return;
            }
            Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', {
                get: () => true,
                configurable: true,
                enumerable: true,
            });
        }
        catch (ex) {
            // Ignore
        }
    }
}

const sendAppMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    return browser.runtime.sendMessage(Object.assign({ handlerName: MESSAGE_HANDLER_NAME }, message));
});

/**
 * Hides broken items after blocking a network request
 */
class ElementCollapser {
    static start() {
        document.addEventListener('error', ElementCollapser.shouldCollapseElement, true);
        // We need to listen for load events to hide blocked iframes (they don't raise error event)
        document.addEventListener('load', ElementCollapser.shouldCollapseElement, true);
    }
    static stop() {
        document.removeEventListener('error', ElementCollapser.shouldCollapseElement, true);
        // We need to listen for load events to hide blocked iframes (they don't raise error event)
        document.removeEventListener('load', ElementCollapser.shouldCollapseElement, true);
    }
    static getRequestTypeByInitiatorTagName(tagName) {
        switch (tagName) {
            case 'img':
            case 'input': {
                return RequestType.Image;
            }
            case 'audio':
            case 'video': {
                return RequestType.Media;
            }
            case 'object':
            case 'embed': {
                return RequestType.Object;
            }
            case 'frame':
            case 'iframe':
                return RequestType.Subdocument;
            default:
                return null;
        }
    }
    /**
     * Extracts element URL from the dom node
     */
    static getElementUrl(element) {
        let elementUrl = element.src || element.data;
        if (!elementUrl
            || elementUrl.indexOf('http') !== 0
            // Some sources could not be set yet, lazy loaded images or smth.
            // In some cases like on gog.com, collapsing these elements could break
            // the page script loading their sources
            || elementUrl === element.baseURI) {
            return null;
        }
        // truncate too long urls
        // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1493
        const MAX_URL_LENGTH = 16 * 1024;
        if (elementUrl.length > MAX_URL_LENGTH) {
            elementUrl = elementUrl.slice(0, MAX_URL_LENGTH);
        }
        return elementUrl;
    }
    static isElementCollapsed(element) {
        const computedStyle = window.getComputedStyle(element);
        return (computedStyle && computedStyle.display === 'none');
    }
    static shouldCollapseElement(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const eventType = event.type;
            const element = event.target;
            const tagName = element.tagName.toLowerCase();
            const expectedEventType = (tagName === 'iframe'
                || tagName === 'frame'
                || tagName === 'embed') ? 'load' : 'error';
            if (eventType !== expectedEventType) {
                return;
            }
            const requestType = ElementCollapser.getRequestTypeByInitiatorTagName(element.localName);
            if (!requestType) {
                return;
            }
            const elementUrl = ElementCollapser.getElementUrl(element);
            if (!elementUrl) {
                return;
            }
            if (ElementCollapser.isElementCollapsed(element)) {
                return;
            }
            const payload = {
                elementUrl,
                documentUrl: document.URL,
                requestType,
            };
            const shouldCollapse = yield sendAppMessage({
                type: MessageType.PROCESS_SHOULD_COLLAPSE,
                payload,
            });
            if (!shouldCollapse) {
                return;
            }
            element.setAttribute('style', 'display: none!important; visibility: hidden!important; height: 0px!important; min-height: 0px!important;');
        });
    }
}

/**
 * This class applies cookie rules in page context
 *
 * - Removes cookies matching rules
 * - Listens to new cookies, then tries to apply rules to them
 */
class CookieController {
    /**
     * Constructor
     *
     * @param callback
     */
    constructor(callback) {
        /**
         * Is current context third-party
         */
        this.isThirdPartyContext = false;
        this.onRuleAppliedCallback = callback;
        this.isThirdPartyContext = this.isThirdPartyFrame();
    }
    /**
     * Applies rules
     *
     * @param rules
     */
    apply(rules) {
        this.applyRules(rules);
        let lastCookie = document.cookie;
        this.listenCookieChange((oldValue, newValue) => {
            if (newValue === lastCookie) {
                // Skip changes made by this class
                return;
            }
            this.applyRules(rules);
            lastCookie = document.cookie;
        });
        window.addEventListener('beforeunload', () => {
            this.applyRules(rules);
        });
    }
    /**
     * Polling document cookie
     *
     * @param callback
     * @param interval
     */
    // eslint-disable-next-line class-methods-use-this
    listenCookieChange(callback, interval = 1000) {
        let lastCookie = document.cookie;
        setInterval(() => {
            const { cookie } = document;
            if (cookie !== lastCookie) {
                try {
                    callback(lastCookie, cookie);
                }
                finally {
                    lastCookie = cookie;
                }
            }
        }, interval);
    }
    /**
     * Checks if current context is third-party
     */
    // eslint-disable-next-line class-methods-use-this
    isThirdPartyFrame() {
        try {
            return window.self !== window.top && document.location.hostname !== window.parent.location.hostname;
        }
        catch (e) {
            return true;
        }
    }
    /**
     * Applies rules to document cookies
     * Inspired by remove-cookie scriptlet
     * https://github.com/AdguardTeam/Scriptlets/blob/master/src/scriptlets/remove-cookie.js
     *
     * @param rules
     */
    applyRules(rules) {
        document.cookie.split(';').forEach((cookieStr) => {
            const pos = cookieStr.indexOf('=');
            if (pos === -1) {
                return;
            }
            const cookieName = cookieStr.slice(0, pos).trim();
            const cookieValue = cookieStr.slice(pos + 1).trim();
            const matchingRules = rules.filter((r) => {
                if (this.isThirdPartyContext !== r.isThirdParty) {
                    return false;
                }
                const regex = r.match ? CookieController.toRegExp(r.match) : CookieController.toRegExp('/.?/');
                return regex.test(cookieName);
            });
            const importantRules = matchingRules.filter((r) => r.ruleText.includes('important'));
            if (importantRules.length > 0) {
                importantRules.forEach((rule) => {
                    this.applyRule(rule, cookieName, cookieValue);
                });
            }
            else {
                const allowlistRules = matchingRules.filter((r) => r.isAllowlist);
                if (allowlistRules.length > 0) {
                    allowlistRules.forEach((rule) => {
                        this.applyRule(rule, cookieName, cookieValue);
                    });
                }
                else {
                    matchingRules.forEach((rule) => {
                        this.applyRule(rule, cookieName, cookieValue);
                    });
                }
            }
        });
    }
    /**
     * Applies rule
     *
     * @param rule
     * @param cookieName
     * @param cookieValue
     */
    applyRule(rule, cookieName, cookieValue) {
        if (!rule.isAllowlist) {
            const hostParts = document.location.hostname.split('.');
            for (let i = 0; i <= hostParts.length - 1; i += 1) {
                const hostName = hostParts.slice(i).join('.');
                if (hostName) {
                    CookieController.removeCookieFromHost(cookieName, hostName);
                }
            }
        }
        this.onRuleAppliedCallback({
            cookieName,
            cookieValue,
            cookieDomain: document.location.hostname,
            cookieRuleText: rule.ruleText,
            thirdParty: rule.isThirdParty,
            filterId: rule.filterId,
        });
    }
    /**
     * Removes cookie for host
     *
     * @param cookieName
     * @param hostName
     */
    static removeCookieFromHost(cookieName, hostName) {
        const cookieSpec = `${cookieName}=`;
        const domain1 = `; domain=${hostName}`;
        const domain2 = `; domain=.${hostName}`;
        const path = '; path=/';
        const expiration = '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = cookieSpec + expiration;
        document.cookie = cookieSpec + domain1 + expiration;
        document.cookie = cookieSpec + domain2 + expiration;
        document.cookie = cookieSpec + path + expiration;
        document.cookie = cookieSpec + domain1 + path + expiration;
        document.cookie = cookieSpec + domain2 + path + expiration;
    }
    /**
     * Converts cookie rule match to regular expression
     *
     * @param str
     */
    static toRegExp(str) {
        if (str[0] === '/' && str[str.length - 1] === '/') {
            return new RegExp(str.slice(1, -1));
        }
        const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^${escaped}$`);
    }
}

/**
 * Initializes assistant object
 */
const initAssistant = () => {
    if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
        return;
    }
    let assistant;
    browser.runtime.onMessage.addListener((message) => {
        switch (message.type) {
            case MessageType.INIT_ASSISTANT: {
                if (!assistant) {
                    assistant = adguardAssistant();
                }
                else {
                    assistant.close();
                }
                assistant.start(null, (rules) => {
                    sendAppMessage({
                        type: MessageType.ASSISTANT_CREATE_RULE,
                        payload: { ruleText: rules },
                    });
                });
                break;
            }
            case MessageType.CLOSE_ASSISTANT: {
                if (assistant) {
                    assistant.close();
                }
                break;
            }
        }
    });
};

ElementCollapser.start();
initAssistant();
// TODO: replace to separate class
const applyExtendedCss = (cssText) => {
    // Init css hits counter
    const cssHitsCounter = new CssHitsCounter((stats) => {
        console.debug('Css stats ready');
        console.debug(stats);
    });
    console.debug('CssHitsCounter initialized');
    // Apply extended css stylesheets
    const extendedCss = new ExtendedCss({
        styleSheet: cssText,
        beforeStyleApplied: (el) => {
            return cssHitsCounter.countAffectedByExtendedCss(el);
        },
    });
    extendedCss.apply();
    console.debug('Extended css applied');
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield sendAppMessage({
        type: MessageType.GET_EXTENDED_CSS,
        payload: {
            documentUrl: window.location.href,
        },
    });
    if (res) {
        applyExtendedCss(res);
    }
}))();
/**
 * Runs CookieController
 *
 * * Steps:
 * - content script requests matching cookie rules for the frame(in which this script is executed)
 * - service returns matching set of rules data to content script
 * - the rules are applied with TSUrlFilterContentScript.CookieController
 * - filtering log receives callback with applied rules data
 *
 * The important point is:
 * - there is no way to run cookie controller script via chrome.tabs.executeScript cause one only could be executed
 * for all frames or main frame only. But it's not correct cause there should be different rules
 * for each frame.
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield sendAppMessage({
        type: MessageType.GET_COOKIE_RULES,
        payload: {
            documentUrl: window.location.href,
        },
    });
    if (!response) {
        return;
    }
    if (response.rulesData) {
        try {
            const cookieController = new CookieController(({ cookieName, cookieValue, cookieDomain, cookieRuleText, thirdParty, filterId, }) => {
                sendAppMessage({
                    type: MessageType.SAVE_COOKIE_LOG_EVENT,
                    payload: {
                        cookieName, cookieValue, cookieDomain, cookieRuleText, thirdParty, filterId,
                    },
                });
            });
            cookieController.apply(response.rulesData);
        }
        catch (e) {
            // Ignore exceptions
        }
    }
}))();

export { CookieController, StealthHelper };
