export default class FiltersApi {
    /**
     * Updates filtering rulesets via declarativeNetRequest
     * @param enableFiltersIds rulesets to enable
     * @param disableFiltersIds rulesets to diable
     */
    static updateFiltering(disableFiltersIds: number[], enableFiltersIds?: number[]): Promise<void>;
    /**
     * Gets current enabled filters IDs
     */
    static getEnabledRulesets(): Promise<number[]>;
}
