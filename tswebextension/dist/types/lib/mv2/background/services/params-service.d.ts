import { FilteringLog } from '../../../common';
/**
 * Params filtering service module
 */
export declare class ParamsService {
    private filteringLog;
    /**
     * Constructor
     *
     * @param filteringLog
     */
    constructor(filteringLog: FilteringLog);
    private static SupportedMethods;
    /**
     * Removes request params from url, stored in request context
     *
     * @param requestId
     * @return modified url or null
     */
    getPurgedUrl(requestId: string): string | null;
    private static isMethodSupported;
}
export declare const paramsService: ParamsService;
