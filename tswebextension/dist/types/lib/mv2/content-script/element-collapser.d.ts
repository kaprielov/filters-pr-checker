/**
 * Hides broken items after blocking a network request
 */
export declare class ElementCollapser {
    static start(): void;
    static stop(): void;
    private static getRequestTypeByInitiatorTagName;
    /**
     * Extracts element URL from the dom node
     */
    private static getElementUrl;
    private static isElementCollapsed;
    private static shouldCollapseElement;
}
