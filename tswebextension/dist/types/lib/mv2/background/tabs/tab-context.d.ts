import { Tabs } from 'webextension-polyfill';
import { NetworkRule } from '@adguard/tsurlfilter';
import { Frame } from './frame';
export interface TabMetadata {
    mainFrameRule?: NetworkRule | null;
    previousUrl?: string;
}
export interface TabContextInterface {
    info: Tabs.Tab;
    frames: Map<number, Frame>;
    metadata: TabMetadata;
    updateTabInfo: (changeInfo: Tabs.OnUpdatedChangeInfoType) => void;
    reloadTabFrameData: (frameUrl: string) => void;
}
export declare const MAIN_FRAME_ID = 0;
export declare class TabContext implements TabContextInterface {
    info: Tabs.Tab;
    frames: Map<number, Frame>;
    metadata: TabMetadata;
    constructor(info: Tabs.Tab);
    updateTabInfo(changeInfo: Tabs.OnUpdatedChangeInfoType): void;
    reloadTabFrameData(url: string): void;
}
