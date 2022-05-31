import { WebRequest } from 'webextension-polyfill';
import { RequestContext } from '../../request';
import { FilteringLog } from '../../../../common';
import { ContentStringFilterInterface } from './content-string-filter';
/**
 * Content Stream Filter class
 *
 * Encapsulates response data stream filtering logic
 * https://mail.mozilla.org/pipermail/dev-addons/2017-April/002729.html
 */
export declare class ContentStream {
    /**
     * Request context
     *
     * This object is mutated during request processing
     */
    private context;
    /**
     * Content Filter
     *
     * Modify content with specified rules
     */
    private contentStringFilter;
    /**
     * Web request filter
     */
    private filter;
    /**
     * Request charset
     */
    private charset;
    /**
     * Content
     */
    private content;
    /**
     * Decoder instance
     */
    private decoder;
    /**
     * Encoder instance
     */
    private encoder;
    /**
     * Filtering log
     */
    private readonly filteringLog;
    /**
     * Contains collection of accepted content types for stream filtering
     */
    private readonly allowedContentTypes;
    constructor(context: RequestContext, contentStringFilter: ContentStringFilterInterface, streamFilterCreator: (id: string) => WebRequest.StreamFilter, filteringLog: FilteringLog);
    init(): void;
    /**
     * Writes data to stream
     *
     * @param content
     */
    write(content: string): void;
    /**
     * Sets charset
     *
     * @param charset
     */
    setCharset(charset: string | null): void;
    /**
     * Disconnects filter from stream
     *
     * @param data
     */
    disconnect(data: BufferSource): void;
    /**
     * Initializes encoders
     */
    private initEncoders;
    private initFilter;
    private shouldProccessFiltering;
    private onResponseData;
    private onResponseError;
    private onResponseFinish;
    /**
     * Parses charset from html
     *
     * @param data
     * @returns {*}
     */
    private static parseHtmlCharset;
    /**
     * Parses charset from html
     *
     * @param data
     * @returns {*}
     */
    private static parseCssCharset;
}
