import { CosmeticOption } from '@adguard/tsurlfilter';
import { Configuration } from '../../common';
declare type FilterConfig = Pick<Configuration, 'filters' | 'userrules' | 'verbose'>;
/**
 * TSUrlFilter Engine wrapper
 */
declare class EngineApi {
    private engine;
    /**
     * Starts engine with provided config
     * @param config config for pass to engine
     */
    startEngine(config: FilterConfig): Promise<void>;
    /**
     * Stops filtering engine
     */
    stopEngine(): Promise<void>;
    /**
     * Gets cosmetic result for the specified url and cosmetic options if engine is started
     * Otherwise returns empty CosmeticResult
     *
     * @param url hostname to check
     * @param option mask of enabled cosmetic types
     * @return cosmetic result
     */
    private getCosmeticResult;
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
    buildCosmeticCss(url: string, options: CosmeticOption, ignoreTraditionalCss: boolean, ignoreExtCss: boolean): {
        css: string[];
        extendedCss: string[];
    };
}
export declare const engineApi: EngineApi;
export {};
