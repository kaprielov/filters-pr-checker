import { z } from 'zod';
import { RequestType } from '@adguard/tsurlfilter';
export declare const MESSAGE_HANDLER_NAME: "tsWebExtension";
export declare enum MessageType {
    PROCESS_SHOULD_COLLAPSE = "PROCESS_SHOULD_COLLAPSE",
    GET_EXTENDED_CSS = "GET_EXTENDED_CSS",
    GET_CSS = "GET_CSS",
    GET_COOKIE_RULES = "GET_COOKIE_RULES",
    SAVE_COOKIE_LOG_EVENT = "SAVE_COOKIE_LOG_EVENT",
    INIT_ASSISTANT = "INIT_ASSISTANT",
    CLOSE_ASSISTANT = "CLOSE_ASSISTANT",
    ASSISTANT_CREATE_RULE = "ASSISTANT_CREATE_RULE"
}
export declare const messageValidator: z.ZodObject<{
    handlerName: z.ZodLiteral<"tsWebExtension">;
    type: z.ZodNativeEnum<typeof MessageType>;
    payload: z.ZodUnknown;
}, "strict", z.ZodTypeAny, {
    payload?: unknown;
    type: MessageType;
    handlerName: "tsWebExtension";
}, {
    payload?: unknown;
    type: MessageType;
    handlerName: "tsWebExtension";
}>;
export declare type Message = z.infer<typeof messageValidator>;
export declare const processShouldCollapsePayloadValidator: z.ZodObject<{
    elementUrl: z.ZodString;
    documentUrl: z.ZodString;
    requestType: z.ZodNativeEnum<typeof RequestType>;
}, "strict", z.ZodTypeAny, {
    elementUrl: string;
    documentUrl: string;
    requestType: RequestType;
}, {
    elementUrl: string;
    documentUrl: string;
    requestType: RequestType;
}>;
export declare type ProcessShouldCollapsePayload = z.infer<typeof processShouldCollapsePayloadValidator>;
export declare const getExtendedCssPayloadValidator: z.ZodObject<{
    documentUrl: z.ZodString;
}, "strict", z.ZodTypeAny, {
    documentUrl: string;
}, {
    documentUrl: string;
}>;
export declare type GetExtendedCssPayloadValidator = z.infer<typeof getExtendedCssPayloadValidator>;
export declare const getCssPayloadValidator: z.ZodObject<{
    url: z.ZodString;
}, "strict", z.ZodTypeAny, {
    url: string;
}, {
    url: string;
}>;
export declare type GetCssPayloadValidator = z.infer<typeof getCssPayloadValidator>;
export declare const getCookieRulesPayloadValidator: z.ZodObject<{
    documentUrl: z.ZodString;
}, "strict", z.ZodTypeAny, {
    documentUrl: string;
}, {
    documentUrl: string;
}>;
export declare type GetCookieRulesPayloadValidator = z.infer<typeof getCookieRulesPayloadValidator>;
export declare const getSaveCookieLogEventPayloadValidator: z.ZodObject<{
    cookieName: z.ZodString;
    cookieDomain: z.ZodString;
    cookieValue: z.ZodString;
    ruleText: z.ZodString;
    filterId: z.ZodNumber;
    thirdParty: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    filterId: number;
    cookieName: string;
    cookieDomain: string;
    cookieValue: string;
    ruleText: string;
    thirdParty: boolean;
}, {
    filterId: number;
    cookieName: string;
    cookieDomain: string;
    cookieValue: string;
    ruleText: string;
    thirdParty: boolean;
}>;
export declare type GetSaveCookieLogEventPayloadValidator = z.infer<typeof getSaveCookieLogEventPayloadValidator>;
export declare const getAssistantCreateRulePayloadValidator: z.ZodObject<{
    ruleText: z.ZodString;
}, "strict", z.ZodTypeAny, {
    ruleText: string;
}, {
    ruleText: string;
}>;
export declare type GetAssistantCreateRulePayloadValidator = z.infer<typeof getAssistantCreateRulePayloadValidator>;
