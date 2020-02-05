"use strict";
/**
 * @module Routing
 * @format
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var checks_1 = require("@thi.ng/checks");
var store_1 = require("../store");
var commands_1 = require("../commands");
var keys_js_1 = require("../keys.js");
var utils_1 = require("../utils");
var SET_STATE = commands_1.createSetStateCMD(store_1.$store$);
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
exports._URL__ROUTE = function (CFG) {
    var __router, __pre, __post, __prefix;
    if (checks_1.isObject(CFG)) {
        var _router = CFG[keys_js_1.router_];
        var _pre = CFG[keys_js_1.prep_];
        var _post = CFG[keys_js_1.post_];
        var _prefix = CFG[keys_js_1.prefix_] || null;
        var escRGX_1 = /[-/\\^$*+?.()|[\]{}]/g;
        var escaped = function (string) { return string.replace(escRGX_1, "\\$&"); };
        var RGX = _prefix ? new RegExp(escaped(_prefix), "g") : null;
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
    return function (acc) {
        var _a, _b, _c;
        return __spread(__pre, [
            (_a = {},
                _a[keys_js_1.args_] = __prefix
                    ? __router(acc[keys_js_1.URL_].replace(__prefix, ""))
                    : __router(acc[keys_js_1.URL_]),
                _a[keys_js_1.reso_] = function (_acc, _res) {
                    var _a;
                    return (_a = {},
                        _a[keys_js_1.URL_page_] = _res[keys_js_1.URL_page_],
                        _a[keys_js_1.URL_data_] = _res[keys_js_1.URL_data_],
                        _a);
                },
                _a[keys_js_1.erro_] = function (_acc, _err) {
                    return console.warn("Error in __URL__ROUTE:", _err, "constructed:", _acc);
                },
                _a),
            (_b = {}, _b[keys_js_1.args_] = __prefix ? utils_1.fURL(acc[keys_js_1.URL_], __prefix) : utils_1.fURL(acc[keys_js_1.URL_]), _b),
            __assign(__assign({}, SET_STATE), (_c = {}, _c[keys_js_1.args_] = function (_acc) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.STATE_] = _acc[keys_js_1.URL_path_],
                    _a[keys_js_1.PATH_] = [keys_js_1.ROUTE_PATH_],
                    _a);
            }, _c))
        ], __post);
    };
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
exports._URL_DOM__ROUTE = function (CFG) {
    // autoscroll view into position
    // scrolly.start()
    // instantiate router
    var match = exports._URL__ROUTE(CFG);
    return function (acc) {
        var _a, _b, _c, _d, _e, _f, _g;
        return [
            __assign(__assign({}, SET_STATE), (_a = {}, _a[keys_js_1.args_] = (_b = {},
                _b[keys_js_1.PATH_] = [keys_js_1.ROUTE_LOADING_],
                _b[keys_js_1.STATE_] = true,
                _b), _a)),
            __assign(__assign({}, commands_1._HREF_PUSHSTATE_DOM), (_c = {}, _c[keys_js_1.args_] = (_d = {}, _d[keys_js_1.URL_] = acc[keys_js_1.URL_], _d[keys_js_1.DOM_] = acc[keys_js_1.DOM_], _d), _c)),
            // example Subtask injection
            function (_acc) {
                var _a;
                return match((_a = {}, _a[keys_js_1.URL_] = _acc[keys_js_1.URL_], _a));
            },
            __assign(__assign({}, SET_STATE), (_e = {}, _e[keys_js_1.args_] = function (_acc) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.PATH_] = [keys_js_1.PAGE_TEMPLATE_],
                    _a[keys_js_1.STATE_] = _acc[keys_js_1.URL_page_],
                    _a);
            }, _e)),
            __assign(__assign({}, SET_STATE), (_f = {}, _f[keys_js_1.args_] = function (_acc) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.PATH_] = _acc[keys_js_1.URL_path_],
                    _a[keys_js_1.STATE_] = _acc[keys_js_1.URL_data_][keys_js_1.BODY_] || _acc[keys_js_1.URL_data_],
                    _a);
            }, _f)),
            // wait on pending promise(s) w/a non-nullary fn (+)=>
            // { ...__SET_ROUTER_LOADING_STATE, args: _ => false },
            // example ad-hoc stream injection
            // { sub$: log$, args: () => ({ DOM }) },
            commands_1._SET_LINK_ATTRS_DOM,
            __assign(__assign({}, SET_STATE), (_g = {}, _g[keys_js_1.args_] = function (_) {
                var _a;
                return (_a = {},
                    _a[keys_js_1.PATH_] = [keys_js_1.ROUTE_LOADING_],
                    _a[keys_js_1.STATE_] = false,
                    _a);
            }, _g)),
            commands_1._NOTIFY_PRERENDER_DOM
        ];
    };
};
