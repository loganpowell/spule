"use strict";
/** @format */
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = __importDefault(require("querystring"));
// import gql from "nanographql"
var keys_js_1 = require("../keys.js");
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
exports.parse = function (URL_full, prefixRGX) {
    var _a;
    // console.log("parsing...")
    var URL_subdomain = [];
    var URL_domain = [];
    var URL_path = [];
    var splitRGX = /(?=\?)|(?=#)/g;
    // split the path on any `?` and/or `#` chars (1-3 parts)
    var parts = prefixRGX
        ? URL_full.replace(prefixRGX, "").split(splitRGX)
        : URL_full.split(splitRGX);
    // take the first component of split: the core URL
    var path_str = parts[0];
    // split the path_str further into individual members and
    // remove the empty string between any adjacent slashes `//`
    var full_path = path_str.split("/").filter(function (x) { return x !== ""; });
    if (/http/i.test(URL_full)) {
        // if the input URL is HTTP(S), partition into sub components
        // domain is the last two members of the 2nd component
        URL_domain = full_path[1].split(".").slice(-2);
        // subdomain is anything before the domain
        // see https://stackoverflow.com/a/56921347
        // for mocking subdomain on localhost
        URL_subdomain = full_path[1].split(".").slice(0, -2);
        // path is the last component in the
        URL_path = full_path.slice(2);
    }
    else {
        // in the case of a relative URL `<a href="/about">
        // the relative path is the full path
        URL_path = full_path;
    }
    // pull out the query component as a string
    var query_str = parts.filter(function (part) { return part.slice(0, 1) === "?"; })[0] || "";
    // pull out the hash component as a string
    var hash_str = parts.filter(function (part) { return part.slice(0, 1) === "#"; })[0] || "";
    // parse the query string into conventional parts using qs
    var URL_query = querystring_1.default.parse(query_str.slice(1));
    // remove the actual `#` hash character from the string
    var URL_hash = hash_str.slice(1);
    return _a = {},
        _a[keys_js_1.URL_FULL] = URL_full,
        _a[keys_js_1.URL_SUBD] = URL_subdomain,
        _a[keys_js_1.URL_DOMN] = URL_domain,
        _a[keys_js_1.URL_PATH] = URL_path,
        _a[keys_js_1.URL_QERY] = URL_query,
        _a[keys_js_1.URL_HASH] = URL_hash,
        _a;
};
/**
 *
 * The reverse of `unFURL` that enables talking to the
 * router with a friendlier API than having to always
 * construct URLs manually.
 *
 */
exports.unparse = function (parsed, isAbsolute) {
    // console.log("unparsing...")
    if (isAbsolute === void 0) { isAbsolute = false; }
    var _a = exports.parse(parsed[keys_js_1.URL_FULL] || window.location.href), _b = keys_js_1.URL_SUBD, URL_subdomain = _a[_b], _c = keys_js_1.URL_DOMN, URL_domain = _a[_c], _d = keys_js_1.URL_PATH, URL_path = _a[_d], _e = keys_js_1.URL_QERY, URL_query = _a[_e], _f = keys_js_1.URL_HASH, URL_hash = _a[_f];
    var _g = parsed._URL_subdomain, _URL_subdomain = _g === void 0 ? URL_subdomain : _g, _h = parsed._URL_domain, _URL_domain = _h === void 0 ? URL_domain : _h, _j = parsed._URL_path, _URL_path = _j === void 0 ? URL_path : _j, _k = parsed._URL_query, _URL_query = _k === void 0 ? URL_query : _k, _l = parsed._URL_hash, _URL_hash = _l === void 0 ? URL_hash : _l;
    var _m = __read(keys_js_1.URL_FULL.split("//"), 2), protocol = _m[0], rest = _m[1];
    var _o = __read(rest.split("/"), 1), root = _o[0];
    var _p = __read(root.split(".")), part_one = _p[0], other_parts = _p.slice(1);
    // console.log({ part_one, other_parts })
    var domain = _URL_subdomain && _URL_domain
        ? __spread(_URL_subdomain, _URL_domain) : _URL_subdomain && other_parts.length > 1
        ? __spread(_URL_subdomain, other_parts) : _URL_subdomain && other_parts.length === 1
        ? __spread(_URL_subdomain, [part_one], other_parts) : __spread(_URL_subdomain, [part_one]);
    var query_string = querystring_1.default.encode(_URL_query);
    var rootRelative = "" + (_URL_path.length > 0 ? "/" + _URL_path.join("/") : "") + (_URL_hash ? "#" + _URL_hash : null) + "?" + query_string;
    // console.log({ domain })
    // console.log({ protocol, rest, root, domain, URL_domain })
    return !isAbsolute
        ? rootRelative
        : protocol + "//" + domain.join(".") + rootRelative;
};
// let test1 = {
//   // URL: "https://api.census.gov",
//   // URL_subdomain: ["sub"],
//   // URL_domain: ["swing", "bloop", "com"],
//   URL_path: ["lens", "path"],
//   // URL_query: {
//   //   GQL: `
//   //       query($name: String!) {
//   //         movie(name: $name) {
//   //           releaseDate
//   //         }
//   //       }
//   //     `.replace(/ |\n/g, ""),
//   //   name: "Back to the Future"
//   // },
//   URL_hash: "scroll-to"
// }
// FURN(test1, true) //?
// unFURL(
//   "https://poop.bloop.gov/data/wipe#something?get=NAME,B101001_10E,group(B61010)&in=state:01&in=county:*&for=tract:*"
// ) //?
// unFURL(
//   "http://sub.swing.bloop.com/lens/path#scroll-to?GQL=query(%24name%3AString!)%7Bmovie(name%3A%24name)%7BreleaseDate%7D%7D&name=Back%20to%20the%20Future"
// ) //?
