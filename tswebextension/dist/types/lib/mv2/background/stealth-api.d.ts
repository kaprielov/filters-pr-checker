import { StringRuleList } from '@adguard/tsurlfilter';
import { Configuration, FilteringLog } from '../../common';
/**
 * Stealth api
 */
export interface StealthApiInterface {
    start: (configuration: Configuration) => void;
    stop: () => void;
}
/**
 * Stealth api implementation
 */
export declare class StealthApi implements StealthApiInterface {
    /**
     * Privacy permission for block webrtc stealth setting
     */
    private static PRIVACY_PERMISSIONS;
    /**
     * Stealth filter identifier
     */
    private static STEALTH_MODE_FILTER_ID;
    /**
     * Stealth configuration
     */
    private configuration;
    /**
     * Stealth service
     */
    private engine;
    /**
     * Filtering log
     */
    private filteringLog;
    constructor(filteringLog: FilteringLog);
    /**
     * Starts service
     *
     * @param configuration
     */
    start(configuration: Configuration): Promise<void>;
    /**
     * Stops service
     */
    stop(): void;
    /**
     * Returns rule list with stealth mode rules
     * @return {StringRuleList}
     */
    getStealthModeRuleList(): StringRuleList | null;
    /**
     * Handler
     *
     * @param details
     */
    private onBeforeSendHeaders;
    /**
     * Updates browser privacy.network settings depending on blocking WebRTC or not
     */
    private handleBlockWebRTC;
    private static canApplyStealthActionsToContext;
    private static canBlockWebRTC;
    private static logError;
}
export declare const stealthApi: StealthApi;
