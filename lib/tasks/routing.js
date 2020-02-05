"use strict";
/**
 * @module Routing
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const checks_1 = require("@thi.ng/checks");
const store_1 = require("../store");
const commands_1 = require("../commands");
const keys_js_1 = require("../keys.js");
const utils_1 = require("../utils");
const SET_STATE = commands_1.createSetStateCMD(store_1.$store$);
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
exports._URL__ROUTE = CFG => {
    let __router, __pre, __post, __prefix;
    if (checks_1.isObject(CFG)) {
        const _router = CFG[keys_js_1.router_];
        const _pre = CFG[keys_js_1.prep_];
        const _post = CFG[keys_js_1.post_];
        const _prefix = CFG[keys_js_1.prefix_] || null;
        const escRGX = /[-/\\^$*+?.()|[\]{}]/g;
        const escaped = string => string.replace(escRGX, "\\$&");
        const RGX = _prefix ? new RegExp(escaped(_prefix), "g") : null;
        // console.log({ router, pre, post })
        __router = _router;
        __pre = checks_1.isObject(_pre) ? [_pre] : _pre || [];
        __post = checks_1.isObject(_post) ? [_post] : _post || [];
        __prefix = RGX;
    }
    else {
        __router = CFG;
        __pre = [];
        __post = [];
        __prefix = null;
    }
    return acc => [
        ...__pre,
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
            [keys_js_1.args_]: __prefix
                ? __router(acc[keys_js_1.URL_].replace(__prefix, ""))
                : __router(acc[keys_js_1.URL_]),
            [keys_js_1.reso_]: (_acc, _res) => ({
                [keys_js_1.URL_page_]: _res[keys_js_1.URL_page_],
                [keys_js_1.URL_data_]: _res[keys_js_1.URL_data_]
            }),
            [keys_js_1.erro_]: (_acc, _err) => console.warn("Error in __URL__ROUTE:", _err, "constructed:", _acc)
        },
        { [keys_js_1.args_]: __prefix ? utils_1.fURL(acc[keys_js_1.URL_], __prefix) : utils_1.fURL(acc[keys_js_1.URL_]) },
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.args_]: _acc => ({
                [keys_js_1.STATE_]: _acc[keys_js_1.URL_path_],
                [keys_js_1.PATH_]: [keys_js_1.ROUTE_PATH_]
            }) }),
        ...__post
    ];
};
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
exports._URL_DOM__ROUTE = CFG => {
    // autoscroll view into position
    // scrolly.start()
    // instantiate router
    const match = exports._URL__ROUTE(CFG);
    return acc => [
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.args_]: {
                [keys_js_1.PATH_]: [keys_js_1.ROUTE_LOADING_],
                [keys_js_1.STATE_]: true
            } }),
        Object.assign(Object.assign({}, commands_1._HREF_PUSHSTATE_DOM), { [keys_js_1.args_]: { [keys_js_1.URL_]: acc[keys_js_1.URL_], [keys_js_1.DOM_]: acc[keys_js_1.DOM_] } }),
        // example Subtask injection
        _acc => match({ [keys_js_1.URL_]: _acc[keys_js_1.URL_] }),
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.args_]: _acc => ({
                [keys_js_1.PATH_]: [keys_js_1.PAGE_TEMPLATE_],
                [keys_js_1.STATE_]: _acc[keys_js_1.URL_page_]
            }) }),
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.args_]: _acc => ({
                [keys_js_1.PATH_]: _acc[keys_js_1.URL_path_],
                [keys_js_1.STATE_]: _acc[keys_js_1.URL_data_][keys_js_1.BODY_] || _acc[keys_js_1.URL_data_]
            }) }),
        // wait on pending promise(s) w/a non-nullary fn (+)=>
        // { ...__SET_ROUTER_LOADING_STATE, args: _ => false },
        // example ad-hoc stream injection
        // { sub$: log$, args: () => ({ DOM }) },
        commands_1._SET_LINK_ATTRS_DOM,
        Object.assign(Object.assign({}, SET_STATE), { [keys_js_1.args_]: _ => ({
                [keys_js_1.PATH_]: [keys_js_1.ROUTE_LOADING_],
                [keys_js_1.STATE_]: false
            }) }),
        commands_1._NOTIFY_PRERENDER_DOM
    ];
};
