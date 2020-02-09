"use strict";
/**
 * @module Registration
 * @format
 */
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
var associative_1 = require("@thi.ng/associative");
var transducers_1 = require("@thi.ng/transducers");
var checks_1 = require("@thi.ng/checks");
var keys_js_1 = require("../keys.js");
var stream__js_1 = require("../core/stream$.js");
var utils_1 = require("../utils");
var feedCMD$fromSource$ = function (cmd) {
    var _a;
    var sub$ = cmd[keys_js_1.CMD_SUB$];
    var args = cmd[keys_js_1.CMD_ARGS];
    var isFn = checks_1.isFunction(args);
    var deliver = function (x) {
        var _a;
        return (_a = {}, _a[keys_js_1.CMD_SUB$] = sub$, _a[keys_js_1.CMD_ARGS] = args(x), _a);
    };
    var delivery = (_a = {}, _a[keys_js_1.CMD_SUB$] = sub$, _a[keys_js_1.CMD_ARGS] = args, _a);
    var feed = function ($) {
        return isFn ? transducers_1.map(function (x) { return $.next(deliver(x)); }) : transducers_1.map(function () { return $.next(delivery); });
    };
    return cmd[keys_js_1.CMD_SRC$].subscribe(feed(stream__js_1.command$));
};
var registered = new associative_1.EquivMap();
var err_str = "command Registration `registerCMD`";
/**
 *
 *
 * Takes a Command object with some additional information
 * and returns a Command `run`able in a Task or as-is.
 *
 * ### Example
 *
 * ```js
 * const genie = {
 *   sub$: "GENIE",
 *   args: "your wish"
 *   work: x => console.log("🧞 says:", x, "is my command")
 * }
 *
 * const GENIE = registerCMD(genie)
 *
 * run(GENIE)
 * // 🧞 says: your wish is my command
 * ```
 *
 * A Command object can have four keys:
 *  1. `sub$` (required)
 *  2. `args` (optional, sets default) during registration
 *  3. `work` (required)
 *  4. `src$` (optional, enables stream to feed Command)
 *
 */
function registerCMD(command) {
    var _a, _b;
    var sub$ = command[keys_js_1.CMD_SUB$];
    var args = command[keys_js_1.CMD_ARGS];
    var erro = command[keys_js_1.CMD_ERRO];
    var reso = command[keys_js_1.CMD_RESO];
    var src$ = command[keys_js_1.CMD_SRC$];
    var work = command[keys_js_1.CMD_WORK];
    var knowns = [keys_js_1.CMD_SUB$, keys_js_1.CMD_ARGS, keys_js_1.CMD_RESO, keys_js_1.CMD_ERRO, keys_js_1.CMD_SRC$, keys_js_1.CMD_WORK];
    var _c = __read(utils_1.diff_keys(knowns, command), 1), unknowns = _c[0];
    // console.log({ knowns, unknowns })
    if (unknowns.length > 0) {
        throw new Error(utils_1.xKeyError(err_str, command, unknowns, sub$, undefined));
    }
    if (src$)
        feedCMD$fromSource$(command);
    // @ts-ignore
    stream__js_1.out$.subscribeTopic(sub$, { next: work, error: console.warn }, transducers_1.map(function (puck) { return puck[keys_js_1.CMD_ARGS]; }));
    var CMD = reso
        ? (_a = {},
            _a[keys_js_1.CMD_SUB$] = sub$,
            _a[keys_js_1.CMD_ARGS] = args,
            _a[keys_js_1.CMD_RESO] = reso,
            _a[keys_js_1.CMD_ERRO] = erro,
            _a) : (_b = {}, _b[keys_js_1.CMD_SUB$] = sub$, _b[keys_js_1.CMD_ARGS] = args, _b);
    // Set.add not supported by IE
    if (registered.set) {
        if (registered.has(sub$)) {
            throw new Error("\n\n  \uD83D\uDD25 duplicate `sub$` value detected in Command:\n  " + utils_1.stringify_w_functions(CMD) + "\n  existing registered Commands:\n  " + JSON.stringify(__spread(registered.keys()), null, 2) + "\n  \uD83D\uDD25 Please use a different/unique Command `sub$` string\n\n  \uD83D\uDD0E Inspect existing Commands using js Map API `registerCMD.all`\n  \uD83D\uDD0E (`registerCMD.all.entries()`, `registerCMD.all.has(\"X\")`, etc.)\n\n        ");
        }
        registered.set(sub$, CMD);
    }
    return CMD;
}
exports.registerCMD = registerCMD;
/**
 * enables inspection of the existing Command registrations
 * if using Chrome, there's an additional advantage of being
 * able to find the `[[FunctionLocation]]` of the Command
 */
registerCMD.all = registered;
