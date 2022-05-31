export interface RedirectsServiceInterface {
    start: () => void;
    createRedirectUrl: (title: string) => string | null;
}
export declare class RedirectsService implements RedirectsServiceInterface {
    redirects: any;
    start(): Promise<void>;
    createRedirectUrl(title: string | null): string | null;
}
export declare const redirectsService: RedirectsService;
