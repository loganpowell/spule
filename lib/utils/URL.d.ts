/** @format */
/**
 *
 * Takes an href (full or relative) and pulls out the various
 * components to be used for instrumentation of various
 * high-level event handling.
 *
 * ## Examples:
 *
 * Ex1:
 * ```js
 * unFURL("http://localhost:1234/about?get=some#today")
 * ```
 * ```js
 * {
 *   URL: "http://localhost:1234/about?get=some#today",
 *   URL_subdomain: [],
 *   URL_domain: ["localhost:1234"],
 *   URL_path: ["about"],
 *   URL_query: { get: "some" },
 *   URL_hash: "today"
 * }
 * ```
 *
 * Ex2:
 * ```js
 * unFURL("https://github.com/thi-ng/umbrella/#blog-posts")
 * ```
 * ```js
 * {
 *   URL: 'https://github.com/thi-ng/umbrella/#blog-posts',
 *   URL_subdomain: [],
 *   URL_domain: ["github", "com"],
 *   URL_path: ["thi-ng", "umbrella"],
 *   URL_query: {},
 *   URL_hash: "blog-posts"
 * }
 * ```
 *
 * Ex3:
 * ```js
 * unFURL("https://very-long-sub.dom.cloud.eu/site/my/happy/")
 * ```
 * ```js
 * {
 *   URL: 'https://very-long-sub.dom.cloud.eu/site/my/happy/',
 *   URL_subdomain: ["very-long-sub", "dom"],
 *   URL_domain: ["cloud", "eu"],
 *   URL_path: ["site", "my", "happy"],
 *   URL_query: {},
 *   URL_hash: ""
 * }
 * ```
 *
 * Ex4:
 * ```js
 * unFURL("https://api.census.gov/data?get=NAME&in=state:01&in=county:*")
 * ```
 * ```js
 * {
 *   URL: "https://api.census.gov/data?get=NAME&in=state:01&in=county:*",
 *   URL_subdomain: ["api"],
 *   URL_domain: ["census", "gov"],
 *   URL_path: ["data"],
 *   URL_query: { get: "NAME", in: ["state:01", "county:*"] },
 *   URL_hash: ""
 * }
 * ```
 *
 * Ex5:
 * ```js
 * unFURL("/data?get=NAME&in=state#indeed")
 * ```
 * ```js
 * {
 *   URL: "/data?get=NAME&in=state#indeed",
 *   URL_subdomain: [],
 *   URL_domain: [],
 *   URL_path: ["data"],
 *   URL_query: { get: "NAME", in: "state" },
 *   URL_hash: "indeed"
 * }
 * ```
 *
 */
export declare const parse: (URL_full: string, prefixRGX?: any) => {
    [x: string]: any;
};
/**
 *
 * The reverse of `unFURL` that enables talking to the
 * router with a friendlier API than having to always
 * construct URLs manually.
 *
 */
export declare const unparse: (parsed: any, isAbsolute?: boolean) => string;
