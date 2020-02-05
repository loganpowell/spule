/**
 * @module Routing
 * @format
 */
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
export declare const URL__ROUTE: (CFG: any) => (acc: any) => any[];
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
export declare const URL_DOM__ROUTE: (CFG: any) => (acc: any) => {
    [x: string]: any;
}[];
