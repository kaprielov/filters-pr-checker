import { DeclarativeConverter, StringRuleList, RequestType, RuleConverter, RuleStorage, setConfiguration, CompatibilityTypes, Engine, CosmeticResult, Request, CosmeticOption } from '@adguard/tsurlfilter';
import { z } from 'zod';
import 'webextension-polyfill';

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class FiltersApi {
    /**
     * Updates filtering rulesets via declarativeNetRequest
     * @param enableFiltersIds rulesets to enable
     * @param disableFiltersIds rulesets to diable
     */
    static updateFiltering(disableFiltersIds, enableFiltersIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chrome.declarativeNetRequest.updateEnabledRulesets({
                enableRulesetIds: (enableFiltersIds === null || enableFiltersIds === void 0 ? void 0 : enableFiltersIds.map((filterId) => `ruleset_${filterId}`)) || [],
                disableRulesetIds: (disableFiltersIds === null || disableFiltersIds === void 0 ? void 0 : disableFiltersIds.map((filterId) => `ruleset_${filterId}`)) || [],
            });
        });
    }
    /**
     * Gets current enabled filters IDs
     */
    static getEnabledRulesets() {
        return __awaiter(this, void 0, void 0, function* () {
            const rulesets = yield chrome.declarativeNetRequest.getEnabledRulesets();
            return rulesets.map((f) => Number.parseInt(f.slice('ruleset_'.length), 10));
        });
    }
}

const USER_FILTER_ID$1 = 0;
class UserRulesApi {
    /**
     * Updates dynamic rules via declarativeNetRequest
     * @param userrules string[] contains custom user rules
     * @param resoursesPath string path to web accessible resourses,
     * relative to the extension root dir. Should start with leading slash '/'
     */
    static updateDynamicFiltering(userrules, resoursesPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = new DeclarativeConverter();
            const list = new StringRuleList(USER_FILTER_ID$1, userrules.join('\n'), false);
            const convertedRules = converter.convert(list, {
                resoursesPath,
            });
            // remove existing dynamic rules, in order their ids not interfere with new
            yield this.removeAllRules();
            yield chrome.declarativeNetRequest.updateDynamicRules({ addRules: convertedRules });
        });
    }
    /**
     * Disables all enabled dynamic rules
     */
    static removeAllRules() {
        return __awaiter(this, void 0, void 0, function* () {
            // get existing dynamic rules
            const existingRules = yield chrome.declarativeNetRequest.getDynamicRules();
            const existingRulesIds = existingRules.map((rule) => rule.id);
            // remove existing dynamic rules
            yield chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: existingRulesIds });
        });
    }
}

const configurationValidator = z.object({
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
const messageValidator = z.object({
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
const getCssPayloadValidator = z.object({
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
 * Simple pub-sub implementation
 */
class EventChannel {
    constructor() {
        this.listeners = [];
    }
    dispatch(data) {
        this.listeners.forEach((listener) => listener(data));
    }
    subscribe(listener) {
        this.listeners.push(listener);
    }
    unsubscribe(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }
}

/**
 * Extract url host
 *
 * @param url
 */
function getHost(url) {
    let firstIdx = url.indexOf('//');
    if (firstIdx === -1) {
        /**
         * It's non hierarchical structured URL (e.g. stun: or turn:)
         * https://tools.ietf.org/html/rfc4395#section-2.2
         * https://tools.ietf.org/html/draft-nandakumar-rtcweb-stun-uri-08#appendix-B
         */
        firstIdx = url.indexOf(':');
        if (firstIdx === -1) {
            return null;
        }
        firstIdx -= 1;
    }
    const nextSlashIdx = url.indexOf('/', firstIdx + 2);
    const startParamsIdx = url.indexOf('?', firstIdx + 2);
    let lastIdx = nextSlashIdx;
    if (startParamsIdx > 0 && (startParamsIdx < nextSlashIdx || nextSlashIdx < 0)) {
        lastIdx = startParamsIdx;
    }
    let host = lastIdx === -1 ? url.substring(firstIdx + 2) : url.substring(firstIdx + 2, lastIdx);
    const portIndex = host.indexOf(':');
    host = portIndex === -1 ? host : host.substring(0, portIndex);
    const lastChar = host.charAt(host.length - 1);
    if (lastChar === '.') {
        host = host.slice(0, -1);
    }
    return host;
}

class FilteringLog {
    constructor() {
        this.onLogEvent = new EventChannel();
    }
    addCookieEvent(data) {
        this.onLogEvent.dispatch({
            type: "COOKIE" /* COOKIE */,
            data,
        });
    }
    addRemoveHeaderEvent(data) {
        this.onLogEvent.dispatch({
            type: "REMOVE_HEADER" /* REMOVE_HEADER */,
            data,
        });
    }
    addRemoveParamEvent(data) {
        this.onLogEvent.dispatch({
            type: "REMOVE_PARAM" /* REMOVE_PARAM */,
            data,
        });
    }
    addHtmlRuleApplyEvent(data) {
        this.onLogEvent.dispatch({
            type: "HTTP_RULE_APPLY" /* HTTP_RULE_APPLY */,
            data,
        });
    }
    addReplaceRuleApplyEvent(data) {
        this.onLogEvent.dispatch({
            type: "REPLACE_RULE_APPLY" /* REPLACE_RULE_APPLY */,
            data,
        });
    }
    addContentFilteringStartEvent(data) {
        this.onLogEvent.dispatch({
            type: "CONTENT_FILTERING_START" /* CONTENT_FILTERING_START */,
            data,
        });
    }
    addContentFilteringFinishEvent(data) {
        this.onLogEvent.dispatch({
            type: "CONTENT_FILTERING_FINISH" /* CONTENT_FILTERING_FINISH */,
            data,
        });
    }
    addStealthActionEvent(data) {
        this.onLogEvent.dispatch({
            type: "STEALTH_ACTION" /* STEALTH_ACTION */,
            data,
        });
    }
}
const defaultFilteringLog = new FilteringLog();

// TODO: Move to common
class CosmeticApi {
    /**
     * Builds stylesheet from rules
     */
    static buildStyleSheet(elemhideRules, injectRules, groupElemhideSelectors) {
        const CSS_SELECTORS_PER_LINE = 50;
        const ELEMHIDE_CSS_STYLE = ' { display: none!important; }\r\n';
        const elemhides = [];
        let selectorsCount = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const selector of elemhideRules) {
            selectorsCount += 1;
            elemhides.push(selector.getContent());
            if (selectorsCount % CSS_SELECTORS_PER_LINE === 0 || !groupElemhideSelectors) {
                elemhides.push(ELEMHIDE_CSS_STYLE);
            }
            else {
                elemhides.push(', ');
            }
        }
        if (elemhides.length > 0) {
            // Last element should always be a style (it will replace either a comma or the same style)
            elemhides[elemhides.length - 1] = ELEMHIDE_CSS_STYLE;
        }
        const elemHideStyle = elemhides.join('');
        const cssStyle = injectRules.map((x) => x.getContent()).join('\r\n');
        const styles = [];
        if (elemHideStyle) {
            styles.push(elemHideStyle);
        }
        if (cssStyle) {
            styles.push(cssStyle);
        }
        return styles;
    }
}

// TODO: Remove call to console
const ASYNC_LOAD_CHINK_SIZE = 5000;
const USER_FILTER_ID = 0;
/**
 * TSUrlFilter Engine wrapper
 */
class EngineApi {
    /**
     * Starts engine with provided config
     * @param config config for pass to engine
     */
    startEngine(config) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('[START ENGINE]: start');
            const { filters, userrules, verbose } = config;
            const lists = [];
            for (let i = 0; i < filters.length; i += 1) {
                const { filterId, content } = filters[i];
                const convertedContent = RuleConverter.convertRules(content);
                lists.push(new StringRuleList(filterId, convertedContent));
            }
            if (userrules.length > 0) {
                const convertedUserRules = RuleConverter.convertRules(userrules.join('\n'));
                lists.push(new StringRuleList(USER_FILTER_ID, convertedUserRules));
            }
            const ruleStorage = new RuleStorage(lists);
            setConfiguration({
                engine: 'extension',
                version: chrome.runtime.getManifest().version,
                verbose,
                compatibility: CompatibilityTypes.extension,
            });
            /*
             * UI thread becomes blocked on the options page while request filter is created
             * that's why we create filter rules using chunks of the specified length
             * Request filter creation is rather slow operation so we should
             * use setTimeout calls to give UI thread some time.
            */
            this.engine = new Engine(ruleStorage, true);
            yield this.engine.loadRulesAsync(ASYNC_LOAD_CHINK_SIZE);
            console.debug('[START ENGINE]: end');
        });
    }
    /**
     * Stops filtering engine
     */
    stopEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            this.engine = undefined;
        });
    }
    /**
     * Gets cosmetic result for the specified url and cosmetic options if engine is started
     * Otherwise returns empty CosmeticResult
     *
     * @param url hostname to check
     * @param option mask of enabled cosmetic types
     * @return cosmetic result
     */
    getCosmeticResult(url, option) {
        if (!this.engine) {
            return new CosmeticResult();
        }
        const frameUrl = getHost(url);
        const request = new Request(url, frameUrl, RequestType.Document);
        return this.engine.getCosmeticResult(request, option);
    }
    /**
     * Builds CSS for the specified web page.
     * http://adguard.com/en/filterrules.html#hideRules
     *
     * @param {string} url Page URL
     * @param {number} options bitmask
     * @param {boolean} ignoreTraditionalCss flag
     * @param {boolean} ignoreExtCss flag
     * @returns {*} CSS and ExtCss data for the webpage
     */
    buildCosmeticCss(url, options, ignoreTraditionalCss, ignoreExtCss) {
        console.debug('[BUILD COSMETIC CSS]: start');
        const cosmeticResult = this.getCosmeticResult(url, options);
        const elemhideCss = [
            ...cosmeticResult.elementHiding.generic,
            ...cosmeticResult.elementHiding.specific,
        ];
        const injectCss = [
            ...cosmeticResult.CSS.generic,
            ...cosmeticResult.CSS.specific,
        ];
        const elemhideExtCss = [
            ...cosmeticResult.elementHiding.genericExtCss,
            ...cosmeticResult.elementHiding.specificExtCss,
        ];
        const injectExtCss = [
            ...cosmeticResult.CSS.genericExtCss,
            ...cosmeticResult.CSS.specificExtCss,
        ];
        const styles = !ignoreTraditionalCss
            ? CosmeticApi.buildStyleSheet(elemhideCss, injectCss, true)
            : [];
        const extStyles = !ignoreExtCss
            ? CosmeticApi.buildStyleSheet(elemhideExtCss, injectExtCss, false)
            : [];
        console.debug('[BUILD COSMETIC CSS]: builded');
        return {
            css: styles,
            extendedCss: extStyles,
        };
    }
}
const engineApi = new EngineApi();

function isHttpOrWsRequest(url) {
    return url.indexOf('http') === 0 || url.indexOf('ws') === 0;
}

class MessagesApi {
    constructor(tsWebExtension) {
        this.tsWebExtension = tsWebExtension;
        this.handleMessage = this.handleMessage.bind(this);
    }
    /**
     * Handles message
     * @param message message
     * @param sender sender of message
     * @returns data according to the received message
     */
    handleMessage(message, sender) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('[HANDLE MESSAGE]: ', message);
            try {
                message = messageValidator.parse(message);
            }
            catch (e) {
                console.error('Bad message', message);
                // ignore
                return;
            }
            const { type } = message;
            switch (type) {
                case MessageType.GET_CSS: {
                    console.debug('[HANDLE MESSAGE]: call getCss');
                    const res = getCssPayloadValidator.safeParse(message.payload);
                    if (!res.success) {
                        return;
                    }
                    let { url } = res.data;
                    // https://github.com/AdguardTeam/AdguardBrowserExtension/issues/1498
                    // when document url for iframe is about:blank then we use tab url
                    if (!isHttpOrWsRequest(url) && sender.frameId !== 0 && ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.url)) {
                        url = sender.tab.url;
                    }
                    return this.getCss(url);
                }
                default: {
                    console.error('Did not found handler for message');
                }
            }
        });
    }
    /**
     * Builds css for specified url
     * @param url url for which build css
     * @returns cosmetic css
     */
    getCss(url) {
        console.debug('[GET CSS]: received call', url);
        if (this.tsWebExtension.isStarted) {
            return engineApi.buildCosmeticCss(url, CosmeticOption.CosmeticOptionAll, false, false);
        }
    }
}

// TODO: implement
class TsWebExtension {
    /**
     * Constructor
     *
     * @param webAccessibleResourcesPath string path to web accessible resourses,
     * relative to the extension root dir. Should start with leading slash '/'
     */
    constructor(webAccessibleResourcesPath) {
        this.onFilteringLogEvent = defaultFilteringLog.onLogEvent;
        this.isStarted = false;
        this.webAccessibleResourcesPath = webAccessibleResourcesPath;
    }
    /**
     * Runs configuration process via saving promise to inner startPromise
     */
    innerStart(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.configuration = configurationValidator.parse(config);
            console.debug('[START]: start');
            try {
                yield this.configure(this.configuration);
            }
            catch (e) {
                this.startPromise = undefined;
                console.debug('[START]: failed', e);
                return;
            }
            this.isStarted = true;
            this.startPromise = undefined;
            console.debug('[START]: started');
        });
    }
    /**
     * Starts filtering
     */
    start(config) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('[START]: is started ', this.isStarted);
            if (this.isStarted) {
                return;
            }
            if (this.startPromise) {
                console.debug('[START]: already called start, waiting');
                yield this.startPromise;
                console.debug('[START]: awaited start');
                return;
            }
            // Call and wait for promise for allow multiple calling start
            this.startPromise = this.innerStart(config);
            yield this.startPromise;
        });
    }
    /**
     * Stops service, disables all user rules and filters
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserRulesApi.removeAllRules();
            const disableFiltersIds = yield FiltersApi.getEnabledRulesets();
            yield FiltersApi.updateFiltering(disableFiltersIds);
            yield engineApi.stopEngine();
            this.isStarted = false;
        });
    }
    /**
     * Uses configuration to pass params to filters, user rules and filter engine
     */
    configure(config) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug('[CONFIGURE]: start with ', config);
            this.configuration = configurationValidator.parse(config);
            const enableFiltersIds = this.configuration.filters
                .map(({ filterId }) => filterId);
            const currentFiltersIds = yield FiltersApi.getEnabledRulesets();
            const disableFiltersIds = currentFiltersIds
                .filter((f) => !enableFiltersIds.includes(f)) || [];
            yield FiltersApi.updateFiltering(disableFiltersIds, enableFiltersIds);
            yield UserRulesApi.updateDynamicFiltering(this.configuration.userrules, this.webAccessibleResourcesPath);
            yield engineApi.startEngine({
                filters: this.configuration.filters,
                userrules: this.configuration.userrules,
                verbose: this.configuration.verbose,
            });
            console.debug('[CONFIGURE]: end');
        });
    }
    openAssistant() { }
    closeAssistant() { }
    getSiteStatus() {
        return "FILTERING_ENABLED" /* FilteringEnabled */;
    }
    getRulesCount() {
        return 0;
    }
    /**
     * @returns messages handler
     */
    getMessageHandler() {
        const messagesApi = new MessagesApi(this);
        return messagesApi.handleMessage;
    }
}

export { MessageType, TsWebExtension };
