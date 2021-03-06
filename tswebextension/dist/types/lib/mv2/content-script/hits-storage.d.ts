/**
 * This storage is used to keep track of counted rules
 * regarding to node elements
 */
export declare class HitsStorage {
    /**
     * Start count number
     */
    private counter;
    /**
     * Storage random identificator
     */
    private randomKey;
    /**
     * Map storage
     */
    private map;
    /**
     * Checks if element is counted
     *
     * @param element html element
     * @param rule rule text
     */
    isCounted(element: any, rule: string): boolean;
    /**
     * Stores rule-element info in storage
     *
     * @param element html element
     * @param rule rule text
     */
    setCounted(element: any, rule: string): void;
    /**
     * @return current count number
     */
    getCounter(): number;
    /**
     * Random id generator
     * @returns {String} - random key with desired length
     */
    private static generateRandomKey;
}
