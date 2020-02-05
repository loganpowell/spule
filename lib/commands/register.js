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
var core_1 = require("../core");
var utils_1 = require("../utils");
var err_str = "command Registration `registerCMD`";
var feedCMD$fromSource$ = function (cmd) {
    var _a;
    var _sub$ = cmd[keys_js_1.sub$_];
    var _args = cmd[keys_js_1.args_];
    var args_is_fn = checks_1.isFunction(_args);
    var deliver = function (x) {
        var _a;
        return (_a = {}, _a[keys_js_1.sub$_] = _sub$, _a[keys_js_1.args_] = _args(x), _a);
    };
    var delivery = (_a = {}, _a[keys_js_1.sub$_] = _sub$, _a[keys_js_1.args_] = _args, _a);
    var feed = function ($) {
        return args_is_fn ? transducers_1.map(function (x) { return $.next(deliver(x)); }) : transducers_1.map(function () { return $.next(delivery); });
    };
    // looks for the `sub$` key to determine if its a command
    return cmd[keys_js_1.source$_].subscribe(feed(core_1.command$));
};
/**
 *
 * ## `registerCMD`
 *
 * Takes a Command object with some additional information
 * and returns a Command usable in a Task or as-is. This
 * also serves the additional benefit of giving the user a
 * constant to use instead of making any typos in keys
 * during use.
 *
 * ### Destructuring Behavior
 *
 * During a `sub$` registration, the keys in the Command
 * object are used to determine the signature of incoming
 * Commands. In order to reduce the amount of boilerplate
 * for Commands that only contain the `sub$` and `args` key,
 * the `args` key is
 * [pluck](https://github.com/thi-ng/umbrella/blob/master/packages/transducers/src/xform/pluck.ts)ed
 * from the incoming Commands. This pulls the `args` value
 * out from the incoming Command objects to be used directly
 * (without the need for dstructuring).
 *
 * ### Example
 *
 * ```js
 * import { registerCMD, run$ } from "🍎"
 *
 * const cmd_pathless = {
 *   sub$: "PATHLESS",
 *   args: { static: "payload" }
 * }
 *
 * const pathless_handler = x => console.log("pathless ->", x)
 *
 * const CMD_PATHLESS = registerCMD(cmd_pathless, pathless_handler)
 *
 * run$.next(CMD_PATHLESS) // 🏃
 * // pathless -> { static: 'payload' }
 *
 * const cmd_path = {
 *   sub$: "PATH",
 *   args: { static: "payload" },
 *   path: ["default", "path"]
 * }
 *
 * const path_handler = x => console.log("path ->", x)
 *
 * const CMD_PATH = registerCMD(cmd_path, path_handler)
 *
 * run$.next(CMD_PATH) // 🏃
 * // path -> { args: { static: 'payload' }, path: [ 'default', 'path' ] }
 *
 * const test_pathless = {
 *   sub$: "PATHLESS",
 *   args: "🔥"
 * }
 *
 * run$.next(test_pathless) // 🏃
 * // pathless -> "🔥"
 * // as you can see, the Command args have been plucked out
 *
 * const test_path = {
 *   sub$: "PATH",
 *   args: "🌊",
 *   path: ["new", "path"]
 * }
 *
 * run$.next(test_path) // 🏃
 * // path -> { args: '🌊', path: [ 'new', 'path' ] }
 * // only the sub$ entry has been removed leaving the rest
 *
 * // NOW: Let's stick these into a Task
 * let TASK_1 = [
 *   { ...CMD_PATH, path: "overwritten" },
 *   CMD_PATHLESS,
 *   { ...test_path, args: "🍝" }
 * ]
 * run$.next(TASK_1)
 * // path -> { args: { static: 'payload' }, path: 'overwritten' }
 * // pathless -> { static: 'payload' }
 * // path -> { args: '🍝', path: [ 'new', 'path' ] }
 *
 * ```
 *
 * @param {Command} command an object with four keys:
 *  1. `sub$` (required)
 *  2. `handler` (required)
 *  3. `args` (optional, sets default) during registration
 *  4. `source$` (optional, enables stream to feed Command)
 *
 */
var registered = new associative_1.EquivMap();
function registerCMD(command) {
    // 📌 TODO: register factory function
    var _a, _b;
    var _sub$ = command[keys_js_1.sub$_];
    var _args = command[keys_js_1.args_];
    var _erro = command[keys_js_1.erro_];
    var _reso = command[keys_js_1.reso_];
    var _source$ = command[keys_js_1.source$_];
    var _handler = command[keys_js_1.handler_];
    var knowns = [keys_js_1.sub$_, keys_js_1.args_, keys_js_1.reso_, keys_js_1.erro_, keys_js_1.source$_, keys_js_1.handler_];
    var _c = __read(utils_1.diff_keys(knowns, command), 1), unknowns = _c[0];
    // console.log({ knowns, unknowns })
    /**
     * destructure the args component out of the emissions
     * to save the user from having to do that PITA everytime
     */
    if (unknowns.length > 0) {
        throw new Error(utils_1.x_key_ERR(err_str, command, unknowns, _sub$, undefined));
    }
    if (_source$)
        feedCMD$fromSource$(command);
    // more: https://github.com/thi-ng/umbrella/blob/develop/examples/rstream-event-loop/src/events.ts
    // @ts-ignore
    core_1.out$.subscribeTopic(_sub$, { next: _handler, error: console.warn }, transducers_1.map(function (emissions) { return emissions[keys_js_1.args_]; }));
    var CMD = _reso
        ? (_a = {}, _a[keys_js_1.sub$_] = _sub$, _a[keys_js_1.args_] = _args, _a[keys_js_1.reso_] = _reso, _a[keys_js_1.erro_] = _erro, _a) : (_b = {}, _b[keys_js_1.sub$_] = _sub$, _b[keys_js_1.args_] = _args, _b);
    // Set.add not supported by IE
    if (registered.set) {
        if (registered.has(_sub$)) {
            throw new Error("\n\n\uD83D\uDD25 duplicate `sub$` value detected in Command:\n" + utils_1.stringify_w_functions(CMD) + "\nexisting registered Commands:\n" + JSON.stringify(__spread(registered.keys()), null, 2) + "\n\uD83D\uDD25 Please use a different/unique Command `sub$` string\n\n\uD83D\uDD0E Inspect existing Commands using js Map API `registerCMD.all`\n\uD83D\uDD0E (`registerCMD.all.entries()`, `registerCMD.all.has(\"X\")`, etc.)\n\n        ");
        }
        registered.set(_sub$, CMD);
    }
    return CMD;
}
exports.registerCMD = registerCMD;
/**
 * enables inspection of the existing Command registrations
 * if using Chrome, there's an additional advantage of being
 * able to find the `[[FunctionLocation]]` of the Command,
 * @example
 * registerCMD.all.entries()
 * // => ⬇ [[Entries]]
 * //      ⬇ 0: {"HURL_CMD" => Object}
 * //          key: "HURL_CMD"
 * //        ⬇ value:
 * //            sub$: "HURL_CMD"
 * //          ⬇ args: ev => ev
 * //              arguments: (...)
 * //              caller: (...)
 * //              length: 1
 * //              name: "args"
 * //            ➡ __proto__: ƒ ()
 * //              [[FunctionLocation]]: routing.js:32 (♻ Chrome)
 * //            ➡ [[Scopes]]: Scopes[2]
 */
registerCMD.all = registered;
