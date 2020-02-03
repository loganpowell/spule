/**
 * @module Routing
 * @format
 */

import { isObject } from "@thi.ng/checks"

import { fURL } from "../utils"
import {
  __HREF_PUSHSTATE_DOM,
  __NOTIFY_PRERENDER_DOM,
  __SET_LINK_ATTRS_DOM,
  SET_STATE
  // msTaskDelay
} from "../commands"
import {
  PAGE_TEMPLATE_,
  ROUTE_LOADING_,
  ROUTE_PATH_,
  DOM_,
  URL_,
  URL_data_,
  URL_path_,
  URL_page_,
  prep_,
  post_,
  prefix_,
  router_,
  args_,
  reso_,
  erro_,
  BODY_,
  STATE_,
  PATH_
} from "../store"

/**
 *
 * `_URL__ROUTE`
 *
 * Universal router (cross-platform) Subtask.
 *
 * This can be used in both a browser and Node context. The
 * parts that handle browser side-effects are included in an
 * Supertask `_URL__ROUTE`
 *
 * Pseudo
 * ```
 * ( router ) => ({ URL }) => [
 * - set `router_loading` path in global atom to `true`
 * - call provided `router` with the `URL` and await payload
 * - `parse_URL(URL)` for `URL_*` components
 * - set `route_path` in global store/atom to current `URL_path`
 * - set page state (data, path & page component name) in store
 * - once promise(s) resolved, set `router_loading` to `false`
 * ]
 * ```
 * reserved Command keys:
 * - `URL_page`
 * - `URL_data`
 * - `URL_path`
 * - `URL`
 * - `DOM`
 */
export const __URL__ROUTE = CFG => {
  let __router, __pre, __post, __prefix

  if (isObject(CFG)) {
    const _router = CFG[router_]
    const _pre = CFG[prep_]
    const _post = CFG[post_]
    const _prefix = CFG[prefix_] || null
    const escRGX = /[-/\\^$*+?.()|[\]{}]/g
    const escaped = string => string.replace(escRGX, "\\$&")

    const RGX = _prefix ? new RegExp(escaped(_prefix), "g") : null
    // console.log({ router, pre, post })
    __router = _router
    __pre = isObject(_pre) ? [_pre] : _pre || []
    __post = isObject(_post) ? [_post] : _post || []
    __prefix = RGX
  } else {
    __router = CFG
    __pre = []
    __post = []
    __prefix = null
  }
  return acc => [
    ...__pre, // 📌 enable progress observation
    /**
     * ## `_SET_ROUTER_LOADING_STATE`cod
     *
     * Routing Command: Universal
     *
     * ### Payload: static
     * default payload `args` signature:
     * ```
     * args: true,
     * ```
     * Simple true or false payload to alert handler
     *
     * ### Handler: side-effecting
     * Sets `route_loading` path in global Atom to true || false
     *
     */
    {
      [args_]: __prefix
        ? __router(acc[URL_].replace(__prefix, ""))
        : __router(acc[URL_]),
      [reso_]: (_acc, _res) => ({
        [URL_page_]: _res[URL_page_],
        [URL_data_]: _res[URL_data_]
      }),
      [erro_]: (_acc, _err) =>
        console.warn("Error in __URL__ROUTE:", _err, "constructed:", _acc)
    },
    { [args_]: __prefix ? fURL(acc[URL_], __prefix) : fURL(acc[URL_]) },
    /**
     * ## `_SET_ROUTER_PATH`
     *
     * Routing Command: Universal
     *
     * ### Payload: function
     * default payload `args` signature:
     * ```
     * args: ({ URL_path }) => ({ URL_path }),
     * ```
     * Consumes the `URL_path` property from a `parse_URL`
     * object, handed off from a prior Command
     *
     * ### Handler: side-effecting
     * Sets the current/loading router's `route_path` in the
     * global Atom
     *
     */
    {
      ...SET_STATE,
      [args_]: _acc => ({
        [STATE_]: _acc[URL_path_],
        [PATH_]: [ROUTE_PATH_]
      })
    },
    ...__post
  ]
}

/**
 *
 * `_URL__ROUTE_DOM`
 *
 * DOM Router that contains a cross-platform routing Subtask
 * `_URL__ROUTE`
 *
 *
 * Subtask HOF for router registration. Takes a
 * `@thi.ng/associative` `EquivMap` route matching function,
 * registers that router as a member of a Task for following
 * Commands to leverage the returned data (`{ data, page }`)
 *
 * Pseudo
 * ```
 * ( router ) => ({ URL, DOM event }) => [
 * - if href, push to `history.pushState`
 * - SUBTASK: _URL__ROUTE (universal router)
 * - remove `active` attribute from visited links except current
 * - notify rendertron (TBD) of new page
 * ]
 * ```
 *
 * reserved Command keys:
 * - `URL`
 * - `DOM`
 * - `URL_page`
 * - `URL_path`
 * - `URL_data`
 */
export const __URL_DOM__ROUTE = CFG => {
  // autoscroll view into position
  // scrolly.start()

  // instantiate router
  const match = __URL__ROUTE(CFG)

  return acc => [
    {
      ...SET_STATE,
      [args_]: {
        [PATH_]: [ROUTE_LOADING_],
        [STATE_]: true
      }
    },
    {
      ...__HREF_PUSHSTATE_DOM,
      [args_]: { [URL_]: acc[URL_], [DOM_]: acc[DOM_] }
    },
    // example Subtask injection
    _acc => match({ [URL_]: _acc[URL_] }),
    // { args: msTaskDelay(2000) },
    /**
     * takes the result from two sources: the user-provided
     * `router` ([@thi.ng/associative:
     * EquivMap](http://thi.ng/associative)) and the `URL_path`
     * from `parse_URL(URL)`
     *
     * ### Handler: side-effecting
     * Hydrates the page state as well as the name of the active
     * page in the global store
     *
     */
    {
      ...SET_STATE,
      [args_]: _acc => ({
        [PATH_]: [PAGE_TEMPLATE_],
        [STATE_]: _acc[URL_page_]
      })
    },
    {
      ...SET_STATE,
      [args_]: _acc => ({
        [PATH_]: _acc[URL_path_],
        [STATE_]: _acc[URL_data_][BODY_] || _acc[URL_data_]
      })
    },
    // wait on pending promise(s) w/a non-nullary fn (+)=>

    // { ...__SET_ROUTER_LOADING_STATE, args: _ => false },
    // example ad-hoc stream injection
    // { sub$: log$, args: () => ({ DOM }) },
    __SET_LINK_ATTRS_DOM,
    {
      ...SET_STATE,
      [args_]: _ => ({
        [PATH_]: [ROUTE_LOADING_],
        [STATE_]: false
      })
    },
    __NOTIFY_PRERENDER_DOM
  ]
}
