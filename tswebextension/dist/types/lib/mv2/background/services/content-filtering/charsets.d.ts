export declare const DEFAULT_CHARSET = "utf-8";
export declare const LATIN_1 = "iso-8859-1";
export declare const WIN_1251 = "windows-1251";
export declare const WIN_1252 = "windows-1252";
/**
 * Supported charsets array
 */
export declare const SUPPORTED_CHARSETS: string[];
/**
 * Parses charset from content-type header
 *
 * @param contentType
 * @returns {*}
 */
export declare function parseCharsetFromHeader(contentType: string | undefined): string | null;
/**
 * Parses charset from html, looking for:
 * <meta charset="utf-8" />
 * <meta charset=utf-8 />
 * <meta charset=utf-8>
 * <meta http-equiv="content-type" content="text/html; charset=utf-8" />
 * <meta content="text/html; charset=utf-8" http-equiv="content-type" />
 *
 * @param text
 */
export declare function parseCharsetFromHtml(text: string): string | null;
/**
 * Parses charset from css
 *
 * @param text
 */
export declare function parseCharsetFromCss(text: string): string | null;
