export interface ResourcesServiceInterface {
    init: (warDir: string) => void;
    stop: () => void;
    createResourceUrl: (path: string) => string;
    loadResource: (path: string) => Promise<string>;
}
/**
 * Foil ability of web pages to identify extension through its web accessible resources.
 *
 * Inspired by:
 * https://github.com/gorhill/uBlock/blob/7f999b759fe540e457e297363f55b25d9860dd3e/platform/chromium/vapi-background
 */
export declare class ResourcesService implements ResourcesServiceInterface {
    private secrets;
    private root;
    private lastSecretTime;
    private warDir;
    private generateSecretKey;
    constructor(generateSecretKey: () => string);
    init(warDir: string): void;
    stop(): void;
    /**
     * Create url for war file
     */
    createResourceUrl(path: string): string;
    /**
     * Load war resource by path
     */
    loadResource(path: string): Promise<string>;
    private createSecretParam;
    private guardWar;
}
export declare const resourcesService: ResourcesService;
