import { z } from 'zod';
export declare const configurationValidator: z.ZodObject<{
    /**
     * Specifies filter lists that will be used to filter content.
     * filterId should uniquely identify the filter so that the API user
     * may match it with the source lists in the filtering log callbacks.
     * content is a string with the full filter list content. The API will
     * parse it into a list of individual rules.
     */
    filters: z.ZodArray<z.ZodObject<{
        filterId: z.ZodNumber;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        content: string;
        filterId: number;
    }, {
        content: string;
        filterId: number;
    }>, "many">;
    /**
     * List of domain names of sites, which should be excluded from blocking
     * or which should be included in blocking depending on the value of
     * allowlistInverted setting value
     */
    allowlist: z.ZodArray<z.ZodString, "many">;
    /**
     * List of rules added by user
     */
    userrules: z.ZodArray<z.ZodString, "many">;
    /**
     * Flag responsible for logging
     */
    verbose: z.ZodBoolean;
    settings: z.ZodObject<{
        /**
         * Flag specifying if ads for sites would be blocked or allowed
         */
        allowlistInverted: z.ZodBoolean;
        /**
         * Enables css hits counter if true
         */
        collectStats: z.ZodBoolean;
        stealth: z.ZodObject<{
            blockChromeClientData: z.ZodBoolean;
            hideReferrer: z.ZodBoolean;
            hideSearchQueries: z.ZodBoolean;
            sendDoNotTrack: z.ZodBoolean;
            blockWebRTC: z.ZodBoolean;
            selfDestructThirdPartyCookies: z.ZodBoolean;
            selfDestructThirdPartyCookiesTime: z.ZodNumber;
            selfDestructFirstPartyCookies: z.ZodBoolean;
            selfDestructFirstPartyCookiesTime: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            blockChromeClientData: boolean;
            hideReferrer: boolean;
            hideSearchQueries: boolean;
            sendDoNotTrack: boolean;
            blockWebRTC: boolean;
            selfDestructThirdPartyCookies: boolean;
            selfDestructThirdPartyCookiesTime: number;
            selfDestructFirstPartyCookies: boolean;
            selfDestructFirstPartyCookiesTime: number;
        }, {
            blockChromeClientData: boolean;
            hideReferrer: boolean;
            hideSearchQueries: boolean;
            sendDoNotTrack: boolean;
            blockWebRTC: boolean;
            selfDestructThirdPartyCookies: boolean;
            selfDestructThirdPartyCookiesTime: number;
            selfDestructFirstPartyCookies: boolean;
            selfDestructFirstPartyCookiesTime: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        allowlistInverted: boolean;
        collectStats: boolean;
        stealth: {
            blockChromeClientData: boolean;
            hideReferrer: boolean;
            hideSearchQueries: boolean;
            sendDoNotTrack: boolean;
            blockWebRTC: boolean;
            selfDestructThirdPartyCookies: boolean;
            selfDestructThirdPartyCookiesTime: number;
            selfDestructFirstPartyCookies: boolean;
            selfDestructFirstPartyCookiesTime: number;
        };
    }, {
        allowlistInverted: boolean;
        collectStats: boolean;
        stealth: {
            blockChromeClientData: boolean;
            hideReferrer: boolean;
            hideSearchQueries: boolean;
            sendDoNotTrack: boolean;
            blockWebRTC: boolean;
            selfDestructThirdPartyCookies: boolean;
            selfDestructThirdPartyCookiesTime: number;
            selfDestructFirstPartyCookies: boolean;
            selfDestructFirstPartyCookiesTime: number;
        };
    }>;
}, "strict", z.ZodTypeAny, {
    settings: {
        allowlistInverted: boolean;
        collectStats: boolean;
        stealth: {
            blockChromeClientData: boolean;
            hideReferrer: boolean;
            hideSearchQueries: boolean;
            sendDoNotTrack: boolean;
            blockWebRTC: boolean;
            selfDestructThirdPartyCookies: boolean;
            selfDestructThirdPartyCookiesTime: number;
            selfDestructFirstPartyCookies: boolean;
            selfDestructFirstPartyCookiesTime: number;
        };
    };
    filters: {
        content: string;
        filterId: number;
    }[];
    allowlist: string[];
    userrules: string[];
    verbose: boolean;
}, {
    settings: {
        allowlistInverted: boolean;
        collectStats: boolean;
        stealth: {
            blockChromeClientData: boolean;
            hideReferrer: boolean;
            hideSearchQueries: boolean;
            sendDoNotTrack: boolean;
            blockWebRTC: boolean;
            selfDestructThirdPartyCookies: boolean;
            selfDestructThirdPartyCookiesTime: number;
            selfDestructFirstPartyCookies: boolean;
            selfDestructFirstPartyCookiesTime: number;
        };
    };
    filters: {
        content: string;
        filterId: number;
    }[];
    allowlist: string[];
    userrules: string[];
    verbose: boolean;
}>;
export declare type Configuration = z.infer<typeof configurationValidator>;
