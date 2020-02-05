"use strict";
/**
 * @module Registration
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var rstream_1 = require("@thi.ng/rstream");
var arrays_1 = require("@thi.ng/arrays");
var transducers_1 = require("@thi.ng/transducers");
var transducers_hdom_1 = require("@thi.ng/transducers-hdom");
var paths_1 = require("@thi.ng/paths");
var keys_js_1 = require("../keys.js");
var store_1 = require("../store");
var commands_1 = require("../commands");
var tasks_1 = require("../tasks");
var utils_1 = require("../utils");
var stream__js_1 = require("./stream$.js");
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
    var taskFrom = tasks_1._URL_DOM__ROUTE(router);
    return commands_1.registerCMD((_a = {},
        _a[keys_js_1.source$_] = stream__js_1.DOMnavigated$,
        _a[keys_js_1.sub$_] = "_URL_NAVIGATED$_DOM",
        _a[keys_js_1.args_] = function (x) { return x; },
        _a[keys_js_1.handler_] = function (args) {
            var _a;
            return stream__js_1.run$.next(taskFrom((_a = {}, _a[keys_js_1.URL_] = args[keys_js_1.URL_], _a[keys_js_1.DOM_] = args[keys_js_1.DOM_], _a)));
        },
        _a));
};
exports.registerRouter = function (router) {
    var _a;
    console.log("Router Registered");
    var taskFrom = tasks_1._URL__ROUTE(router);
    return commands_1.registerCMD((_a = {},
        _a[keys_js_1.sub$_] = "_URL_NAVIGATED$",
        // 📌 TODO: add source for API access/server source$
        _a[keys_js_1.source$_] = stream__js_1.DOMnavigated$,
        _a[keys_js_1.args_] = function (x) { return x; },
        _a[keys_js_1.handler_] = function (args) {
            var _a;
            return stream__js_1.run$.next(taskFrom((_a = {}, _a[keys_js_1.URL_] = args[keys_js_1.URL_], _a[keys_js_1.DOM_] = args[keys_js_1.DOM_], _a)));
        },
        _a));
};
var pre = function (ctx, body) { return (console.log("no `app` component provided to `" + exports.boot.name + "({" + keys_js_1.app_ + "})`. Rendering state by route path"),
    ["pre", JSON.stringify(body[1], null, 2)]); };
/**
 *
 *  Part I: Needs to be a functional component to accept the
 *  `ctx` object to pass it to children
 *
 *  Part II: Takes the root RAF stream and updates the shell
 *  on every global state mutation
 *
 *  Part III: Connects the app shell to the state stream,
 *  which is triggered by any updates to the global
 *  `$store$`
 */
/* ({
  root = document.body,
  app = pre,
  draft,
  router,
  trace,
  ...others
}) */
exports.boot = function (CFG) { return __awaiter(void 0, void 0, void 0, function () {
    var _root, _app, _draft, _router, _trace, knowns, _a, others, escRGX, escaped, _prefix, RGX, state$, shell;
    var _b;
    return __generator(this, function (_c) {
        _root = CFG[keys_js_1.root_] || document.body;
        _app = CFG[keys_js_1.app_] || pre;
        _draft = CFG[keys_js_1.draft_];
        _router = CFG[keys_js_1.router_];
        _trace = CFG[keys_js_1.trace_];
        knowns = [keys_js_1.root_, keys_js_1.app_, keys_js_1.draft_, keys_js_1.router_, keys_js_1.trace_];
        _a = __read(utils_1.diff_keys(knowns, CFG), 2), others = _a[1];
        escRGX = /[-/\\^$*+?.()|[\]{}]/g;
        escaped = function (string) { return string.replace(escRGX, "\\$&"); };
        _prefix = _router[keys_js_1.prefix_] || null;
        RGX = _prefix ? new RegExp(escaped(_prefix || ""), "g") : null;
        if (_router)
            exports.registerRouterDOM(_router);
        state$ = rstream_1.fromAtom(store_1.$store$);
        shell = function (state$) { return (_trace ? console.log(_trace, state$) : null,
            state$[keys_js_1.ROUTE_LOADING_]
                ? null
                : [_app, [state$[keys_js_1.PAGE_TEMPLATE_], paths_1.getIn(state$, state$[keys_js_1.ROUTE_PATH_])]]); };
        if (_draft)
            store_1.$store$.swap(function (x) { return (__assign(__assign({}, _draft), x)); });
        store_1.$store$.resetIn(keys_js_1.ROOT_, _root);
        state$.subscribe(rstream_1.sidechainPartition(rstream_1.fromRAF())).transform(transducers_1.map(arrays_1.peek), transducers_1.map(shell), transducers_hdom_1.updateDOM({
            root: _root,
            span: false,
            ctx: __assign((_b = {}, _b[keys_js_1.run_] = function (x) { return stream__js_1.run$.next(x); }, _b[keys_js_1.state_] = store_1.$store$, _b[utils_1.fURL.name] = function () {
                // console.log({ fURL }),
                return utils_1.fURL(window.location.href, RGX);
            }, _b), others)
        }));
        return [2 /*return*/];
    });
}); };
