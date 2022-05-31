import { NetworkRule, RequestType } from '@adguard/tsurlfilter';
import { TabContext } from './tab-context';
import { Frame } from './frame';
import { EventChannel, EventChannelInterface } from '../../../common';
export interface TabsApiInterface {
    start: () => Promise<void>;
    stop: () => void;
    getTabContext: (tabId: number) => TabContext | undefined;
    setTabFrameRule: (tabId: number, frameRule: NetworkRule) => void;
    getTabFrameRule: (tabId: number) => NetworkRule | null;
    setTabFrame: (tabId: number, frameId: number, frameData: Frame) => void;
    getTabFrame: (tabId: number, frameId: number) => Frame | null;
    getTabMainFrame: (tabId: number) => Frame | null;
    recordRequestFrame: (tabId: number, frameId: number, referrerUrl: string, requestType: RequestType) => void;
    onCreate: EventChannelInterface<TabContext>;
    onUpdate: EventChannelInterface<TabContext>;
    onDelete: EventChannelInterface<TabContext>;
}
export declare class TabsApi implements TabsApiInterface {
    private context;
    onCreate: EventChannel<TabContext>;
    onUpdate: EventChannel<TabContext>;
    onDelete: EventChannel<TabContext>;
    constructor();
    start(): Promise<void>;
    stop(): void;
    setTabFrameRule(tabId: number, frameRule: NetworkRule): void;
    getTabFrameRule(tabId: number): NetworkRule | null;
    setTabFrame(tabId: number, frameId: number, frameData: Frame): void;
    getTabFrame(tabId: number, frameId: number): Frame | null;
    getTabMainFrame(tabId: number): Frame | null;
    recordRequestFrame(tabId: number, frameId: number, url: string, requestType: RequestType): void;
    getTabContext(tabId: number): TabContext | undefined;
    private createTabContext;
    private deleteTabContext;
    private updateTabContextData;
    private createCurrentTabsContext;
    static injectScript(code: string, tabId: number, frameId?: number): void;
    static injectCss(code: string, tabId: number, frameId?: number): void;
}
export declare const tabsApi: TabsApi;
