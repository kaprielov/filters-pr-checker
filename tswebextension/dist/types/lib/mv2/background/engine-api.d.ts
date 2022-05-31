import { RequestType, NetworkRule, MatchingResult, CosmeticResult, CosmeticOption } from '@adguard/tsurlfilter';
import { Configuration } from '../../common';
/**
 * Request Match Query
 */
export interface MatchQuery {
    requestUrl: string;
    frameUrl: string;
    requestType: RequestType;
    frameRule?: NetworkRule | null;
}
export interface EngineApiInterface {
    startEngine: (configuration: Configuration) => Promise<void>;
    /**
     * Gets matching result for request.
     */
    matchRequest: (matchQuery: MatchQuery) => MatchingResult | null;
    /**
     * Matches current frame url and returns document-level rule if found.
     */
    matchFrame: (frameUrl: string) => NetworkRule | null;
    /**
     * Gets cosmetic result for the specified hostname and cosmetic options
     */
    getCosmeticResult: (url: string, option: CosmeticOption) => CosmeticResult;
    getRulesCount: () => number;
}
/**
 * TSUrlFilter Engine wrapper
 */
export declare class EngineApi implements EngineApiInterface {
    private engine;
    startEngine(configuration: Configuration): Promise<void>;
    matchRequest(matchQuery: MatchQuery): MatchingResult | null;
    matchFrame(frameUrl: string): NetworkRule | null;
    getCosmeticResult(url: string, option: CosmeticOption): CosmeticResult;
    getRulesCount(): number;
}
export declare const engineApi: EngineApi;
