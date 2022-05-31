import ExtendedCss from 'extended-css';
import { z } from 'zod';
import { RequestType } from '@adguard/tsurlfilter';
import browser from 'webextension-polyfill';

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

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

const sendAppMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    return browser.runtime.sendMessage(Object.assign({ handlerName: MESSAGE_HANDLER_NAME }, message));
});

// TODO: Add extended css
// TODO: It helps only with Force refresh (via drop cache).
// For just F5 - cosmetic css won't be applied
const applyCss = (cssContent) => {
    if (!cssContent || cssContent.length === 0) {
        return;
    }
    const styleEl = document.createElement('style');
    styleEl.setAttribute('type', 'text/css');
    styleEl.textContent = cssContent;
    (document.head || document.documentElement).appendChild(styleEl);
    console.debug('[COSMETIC CSS]: applied');
};
const applyExtendedCss = (cssText) => {
    if (!cssText || cssText.length === 0) {
        return;
    }
    // Apply extended css stylesheets
    const extendedCss = new ExtendedCss({
        styleSheet: cssText,
    });
    extendedCss.apply();
    console.debug('[EXTENDED CSS]: applied');
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield sendAppMessage({
        type: MessageType.GET_CSS,
        payload: {
            url: document.location.href,
        },
    });
    console.debug('[GET_CSS]: result ', res);
    if (res) {
        const { css, extendedCss } = res;
        applyCss(css === null || css === void 0 ? void 0 : css.join(''));
        applyExtendedCss(extendedCss === null || extendedCss === void 0 ? void 0 : extendedCss.join(''));
    }
}))();
