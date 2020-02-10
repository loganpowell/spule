"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module core/registers
 */
var rstream_1 = require("@thi.ng/rstream");
var arrays_1 = require("@thi.ng/arrays");
var transducers_1 = require("@thi.ng/transducers");
var transducers_hdom_1 = require("@thi.ng/transducers-hdom");
var paths_1 = require("@thi.ng/paths");
var keys_1 = require("../keys");
var store_1 = require("../store");
var register_1 = require("../commands/register");
var tasks_1 = require("../tasks");
var utils_1 = require("../utils");
var stream_1 = require("./stream$");
/**
 *
 * expects payload of
 * ```
 * { target: { location: { href } }, currentTarget }
 * ```
 */
exports.registerRouterDOM = function (router) {
    var _a;
    console.log("DOM Router Registered");
    var taskFrom = tasks_1.URL_DOM__ROUTE(router);
    return register_1.registerCMD((_a = {},
        _a[keys_1.CMD_SRC$] = stream_1.DOMnavigated$,
        _a[keys_1.CMD_SUB$] = "_URL_NAVIGATED$_DOM",
        _a[keys_1.CMD_ARGS] = function (x) { return x; },
        _a[keys_1.CMD_WORK] = function (args) {
            var _a;
            return stream_1.run$.next(taskFrom((_a = {}, _a[keys_1.URL_FULL] = args[keys_1.URL_FULL], _a[keys_1.DOM_NODE] = args[keys_1.DOM_NODE], _a)));
        },
        _a));
};
// TODO: server router must be fed from `http` or something (req/res), not `DOMnavigated$`
// export const registerRouter = router => {
//   console.log("Router Registered")
//   const taskFrom = URL__ROUTE(router)
//   return registerCMD({
//     [CMD_SUB$]: "_URL_NAVIGATED$",
//     [CMD_SRC$]: DOMnavigated$,
//     [CMD_ARGS]: x => x,
//     [CMD_WORK]: args =>
//       run$.next(taskFrom({ [URL_FULL]: args[URL_FULL], [DOM_NODE]: args[DOM_NODE] }))
//   })
// }
var pre = function (ctx, body) { return (console.log("\n    no " + keys_1.CFG_VIEW + " component provided to boot({ CFG }). \n    Rendering state by route path\n    "),
    ["pre", JSON.stringify(body[1], null, 2)]); };
// prettier-ignore
/**
 *
 * Options Object keys
 * - root   : DOM mount node
 * - app    : root application node
 * - draft  : state scaffolding Object
 * - router : url matching function or config Object
 * - trace  : string triggers logs prepended with it
 * - kick   : boolean triggers kickstart (for some sandboxes)
 * - prefix : ignore a part of the URL (e.g., gitub.io/<prefix>)
 *
 */
exports.boot = function (CFG) {
    var _a;
    var root = CFG[keys_1.CFG_ROOT] || document.body;
    var view = CFG[keys_1.CFG_VIEW] || pre;
    var draft = CFG[keys_1.CFG_DRFT];
    var router = CFG[keys_1.CFG_RUTR];
    var log$ = CFG[keys_1.CFG_LOG$];
    var kick = CFG[keys_1.CFG_KICK];
    var knowns = [keys_1.CFG_ROOT, keys_1.CFG_VIEW, keys_1.CFG_DRFT, keys_1.CFG_RUTR, keys_1.CFG_LOG$];
    var prfx = router[keys_1.ROUTER_PRFX] || null;
    var _b = __read(utils_1.diff_keys(knowns, CFG), 2), others = _b[1];
    var escRGX = /[-/\\^$*+?.()|[\]{}]/g;
    var escaped = function (str) { return str.replace(escRGX, "\\$&"); };
    var RGX = prfx ? new RegExp(escaped(prfx || ""), "g") : null;
    if (router)
        exports.registerRouterDOM(router);
    var state$ = rstream_1.fromAtom(store_1.$store$);
    var shell = function (state$) { return (log$ ? console.log(log$, state$) : null,
        state$[keys_1.$$_LOAD]
            ? null
            : [view, [state$[keys_1.$$_VIEW], paths_1.getIn(state$, state$[keys_1.$$_PATH])]]); };
    if (draft)
        store_1.$store$.swap(function (x) { return (__assign(__assign({}, draft), x)); });
    store_1.$store$.resetIn(keys_1.$$_ROOT, root);
    state$.subscribe(rstream_1.sidechainPartition(rstream_1.fromRAF())).transform(transducers_1.map(arrays_1.peek), transducers_1.map(shell), transducers_hdom_1.updateDOM({
        root: root,
        span: false,
        ctx: __assign((_a = {}, _a[keys_1.CFG_RUN$] = function (x) { return stream_1.run$.next(x); }, _a[keys_1.CFG_STOR] = store_1.$store$, _a[keys_1.URL_PRSE] = function () {
            // console.log({ FURL }),
            return utils_1.parse(window.location.href, RGX);
        }, _a), others)
    }));
    // Just a little kick in the pants for those stubborn sandboxes
    if (kick) {
        stream_1.DOMnavigated$.next({
            target: document,
            currentTarget: document
        });
    }
};
