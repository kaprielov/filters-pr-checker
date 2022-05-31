import { RequestContextStorage } from '../request';
export interface Injection {
    jsScriptText?: string;
    cssText?: string;
    extCssText?: string;
}
export interface FrameData {
    url: string;
    injection?: Injection;
}
export declare class Frame {
    url: string;
    injection: Injection | undefined;
    requests: RequestContextStorage;
    constructor(data: FrameData);
}
