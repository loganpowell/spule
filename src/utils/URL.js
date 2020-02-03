/** @format */

import qs from "querystring"
// import gql from "nanographql"
import {
  URL_,
  URL_subdomain_,
  URL_domain_,
  URL_query_,
  URL_hash_,
  URL_path_
} from "../constants.js"

/**
 * # HREF/URL Parser
 *
 * Takes an href (full or relative) and pulls out the various
 * components to be used for instrumentation of various
 * high-level event handling.
 *
 * ## Examples:
 *
 * Ex1:
 * ```js
 * parse_href("http://localhost:1234/about?get=some#today")
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
 * parse_href("https://github.com/thi-ng/umbrella/#blog-posts")
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
 * parse_href("https://very-long-sub.dom.cloud.eu/site/my/happy/")
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
 * parse_href("https://api.census.gov/data?get=NAME&in=state:01&in=county:*")
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
 * parse_href("/data?get=NAME&in=state#indeed")
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
 * @param {string} URL - full or partial URL/href
 *
 * */
export const fURL = (_URL, prefixRGX) => {
  // console.log("parsing...")
  let URL_subdomain = []
  let URL_domain = []
  let URL_path = []

  const splitRGX = /(?=\?)|(?=#)/g
  // split the path on any `?` and/or `#` chars (1-3 parts)
  const parts = prefixRGX
    ? _URL.replace(prefixRGX, "").split(splitRGX)
    : _URL.split(splitRGX)
  // take the first component of split: the core URL
  const path_str = parts[0]
  // split the path_str further into individual members and
  // remove the empty string between any adjacent slashes `//`
  const full_path = path_str.split("/").filter(x => x !== "")
  if (/http/i.test(_URL)) {
    // if the input URL is HTTP(S), partition into sub components
    // domain is the last two members of the 2nd component
    URL_domain = full_path[1].split(".").slice(-2)
    // subdomain is anything before the domain
    // see https://stackoverflow.com/a/56921347
    // for mocking subdomain on localhost
    URL_subdomain = full_path[1].split(".").slice(0, -2)
    // path is the last component in the
    URL_path = full_path.slice(2)
  } else {
    // in the case of a relative URL `<a href="/about">
    // the relative path is the full path
    URL_path = full_path
  }
  // pull out the query component as a string
  const query_str = parts.filter(part => part.slice(0, 1) === "?")[0] || ""
  // pull out the hash component as a string
  const hash_str = parts.filter(part => part.slice(0, 1) === "#")[0] || ""
  // parse the query string into conventional parts using qs
  const URL_query = qs.parse(query_str.slice(1))
  // remove the actual `#` hash character from the string
  const URL_hash = hash_str.slice(1)
  return {
    [URL_]: _URL,
    [URL_subdomain_]: URL_subdomain,
    [URL_domain_]: URL_domain,
    [URL_path_]: URL_path,
    [URL_query_]: URL_query,
    [URL_hash_]: URL_hash
  }
}

/**
 *
 * `unparse_URL`
 *
 * The reverse of `parse_URL` that enables talking to the
 * router with a friendlier API than having to always
 * construct URLs manually.
 *
 * TODO: testing for `unparse_URL`
 *
 */
export const unfURL = (parsed, isAbsolute = false) => {
  // console.log("unparsing...")

  const {
    [URL_subdomain_]: URL_subdomain,
    [URL_domain_]: URL_domain,
    [URL_path_]: URL_path,
    [URL_query_]: URL_query,
    [URL_hash_]: URL_hash
  } = fURL(parsed[URL_] || window.location.href)

  const {
    _URL_subdomain = URL_subdomain,
    _URL_domain = URL_domain,
    _URL_path = URL_path,
    _URL_query = URL_query,
    _URL_hash = URL_hash
  } = parsed

  const [protocol, rest] = URL_.split("//")
  const [root] = rest.split("/")
  const [part_one, ...other_parts] = root.split(".")
  // console.log({ part_one, other_parts })

  const domain =
    _URL_subdomain && _URL_domain
      ? [..._URL_subdomain, ..._URL_domain]
      : _URL_subdomain && other_parts.length > 1
      ? [..._URL_subdomain, ...other_parts]
      : _URL_subdomain && other_parts.length === 1
      ? [..._URL_subdomain, part_one, ...other_parts]
      : [..._URL_subdomain, part_one]

  const query_string = qs.encode(_URL_query)

  const rootRelative = `${
    _URL_path.length > 0 ? "/" + _URL_path.join("/") : ""
  }${_URL_hash ? "#" + _URL_hash : null}?${query_string}`

  // console.log({ domain })
  // console.log({ protocol, rest, root, domain, URL_domain })
  return !isAbsolute
    ? rootRelative
    : `${protocol}//${domain.join(".")}${rootRelative}`
}

/*
let test1 = {
  // URL: "https://api.census.gov",
  // URL_subdomain: ["sub"],
  // URL_domain: ["swing", "bloop", "com"],
  URL_path: ["lens", "path"],
  // URL_query: {
  //   GQL: `
  //       query($name: String!) {
  //         movie(name: $name) {
  //           releaseDate
  //         }
  //       }
  //     `.replace(/ |\n/g, ""),
  //   name: "Back to the Future"
  // },
  URL_hash: "scroll-to"
}
unparse_URL(test1, true) //?

parse_URL(
  "https://poop.bloop.gov/data/wipe#something?get=NAME,B101001_10E,group(B61010)&in=state:01&in=county:*&for=tract:*"
)

parse_URL(
  "http://sub.swing.bloop.com/lens/path#scroll-to?GQL=query(%24name%3AString!)%7Bmovie(name%3A%24name)%7BreleaseDate%7D%7D&name=Back%20to%20the%20Future"
) //?

*/
