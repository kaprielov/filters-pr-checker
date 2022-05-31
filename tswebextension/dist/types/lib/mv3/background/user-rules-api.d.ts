export default class UserRulesApi {
    /**
     * Updates dynamic rules via declarativeNetRequest
     * @param userrules string[] contains custom user rules
     * @param resoursesPath string path to web accessible resourses,
     * relative to the extension root dir. Should start with leading slash '/'
     */
    static updateDynamicFiltering(userrules: string[], resoursesPath?: string): Promise<void>;
    /**
     * Disables all enabled dynamic rules
     */
    static removeAllRules(): Promise<void>;
}
