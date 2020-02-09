"use strict";
/**
 * @module multiplex
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
var checks_1 = require("@thi.ng/checks");
var keys_js_1 = require("../keys.js");
var utils_1 = require("../utils");
var stream__js_1 = require("./stream$.js");
var err_str = "Spooling Interupted"; // <- add doc link to error strings
var nosub$_err = function (c, i) {
    return console.warn("\n  \uD83D\uDD25 No sub$ included for a Command with a primitive for 'args'. \n  \uD83D\uDD25 Ergo, nothing was done with this Command: \n  \n  " + JSON.stringify(c) + "\n  \n  " + utils_1.key_index_err(c, i) + "\n  \n  Hope that helps!\n  ");
};
/**
 *
 * Handles Collections (array) of Commands ("Tasks") which
 * require _ordered_ choreography and/or have a dependency
 * on some (a)sync data produced by a user interaction.
 *
 * ### Subtasks:
 *
 * Subtasks are the way you compose tasks. Insert a Task and
 * the spool will unpack it in place (super -> sub
 * order preserved) A Subtask must be defined as a unary
 * function that accepts an accumulator object and returns a
 * Task, e.g.:
 *
 * #### PSEUDO
 * ```js
 * // { C: Command }
 * // ( { A: Accumulator }: Object ) => [{C},{C}]: Subtask
 * let someSubtask = ({A}) => [{C}, {C}, ({A})=>[{C},{C}], ...]
 * ```
 *
 * #### Example
 * ```js
 * // subtask example:
 * let subtask1 = acc => [
 *  { sub$: "acc"
 *  , args: { data: acc.data } },
 *  { sub$: "route"
 *  , args: { route: { href: acc.href } } }
 * ]
 *
 * // task
 * let task = [
 *  { args: { href: "https://my.io/todos" } }, // acc init
 *  { sub$: "fetch"
 *  , args: ({ href }) => fetch(href).then(r => r.json())
 *  , erro: (acc, err) => ({ sub$: "cancel", args: err })
 *  , reso: (acc, res) => ({ data: res }) },
 *  acc => subtask1(acc), // subtask reference
 *  { sub$: "FLIP" , args: "done" }
 * ]
 * ```
 * ### Ad-hoc stream injection Example
 *
 * ```js
 * import { stream } from "@thi.ng/rstream"
 * import { map, comp } from "@thi.ng/transducers"
 *
 * // ad-hoc stream
 * let login = stream().subscribe(comp(
 *  map(x => console.log("login ->", x)),
 *  map(({ token }) => loginToMyAuth(token))
 * ))
 *
 * // subtask
 * let subtask_login = ({ token }) => [
 *  { sub$: login // <- stream
 *  , args: () => ({ token }) } // <- use acc
 * ]
 *
 * // task
 * let task = [
 *  // no sub$, just pass data
 *  { args: { href: "https://my.io/auth" } },
 *  { sub$: login , args: () => "logging in..." },
 *  { sub$: "AUTH"
 *  , args: ({ href }) => fetch(href).then(r => r.json())
 *  , erro: (acc, err) => ({ sub$: "cancel", args: err })
 *  , reso: (acc, res) => ({ token: res }) },
 *  acc => subtask_login(acc),
 *  { sub$: login , args: () => "log in success" }
 * ]
 * ```
 *
 **/
exports.multiplex = function (task_array) {
    return task_array.reduce(function (a, c, i) { return __awaiter(void 0, void 0, void 0, function () {
        var acc, recur, sub$, args, erro, reso, knowns, _a, unknowns, arg_type, result, temp, _b, error, resolved;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, a
                    // console.log("ACCUMULATOR =>", acc)
                ];
                case 1:
                    acc = _f.sent();
                    // console.log("ACCUMULATOR =>", acc)
                    if (checks_1.isFunction(c)) {
                        try {
                            recur = c(acc);
                            // ensures accumulator is preserved between stacks
                            recur.unshift((_c = {}, _c[keys_js_1.CMD_ARGS] = acc, _c));
                            return [2 /*return*/, exports.multiplex(recur)];
                        }
                        catch (e) {
                            console.warn(err_str, e);
                            return [2 /*return*/];
                        }
                    }
                    sub$ = c[keys_js_1.CMD_SUB$];
                    args = c[keys_js_1.CMD_ARGS];
                    erro = c[keys_js_1.CMD_ERRO];
                    reso = c[keys_js_1.CMD_RESO];
                    knowns = [keys_js_1.CMD_SUB$, keys_js_1.CMD_ARGS, keys_js_1.CMD_RESO, keys_js_1.CMD_ERRO, keys_js_1.CMD_SRC$, keys_js_1.CMD_WORK];
                    _a = __read(utils_1.diff_keys(knowns, c), 1), unknowns = _a[0];
                    if (unknowns.length > 0)
                        throw new Error(utils_1.xKeyError(err_str, c, unknowns, sub$, i));
                    arg_type = utils_1.stringify_type(args);
                    result = args;
                    /* RESOLVING ARGS */
                    if (arg_type !== "PROMISE" && reso) {
                        /**
                         * If some signature needs to deal with both Promises
                         * and non-Promises, non-Promises are wrapped in a
                         * Promise to "lift" them into the proper context for
                         * handling
                         */
                        result = Promise.resolve(args);
                    }
                    if (args !== Object(args) && !sub$) {
                        nosub$_err(c, i);
                        return [2 /*return*/, acc];
                    }
                    if (!(arg_type === "PROMISE")) return [3 /*break*/, 3];
                    return [4 /*yield*/, args.catch(function (e) { return e; })];
                case 2:
                    // result = await discardable(args).catch(e => e)
                    result = _f.sent();
                    _f.label = 3;
                case 3:
                    if (arg_type === "THUNK") {
                        // if thunk, dispatch to ad-hoc stream, return acc
                        // as-is ⚠ this command will not be waited on
                        result = args();
                        console.log("dispatching to ad-hoc stream: " + sub$.id);
                        sub$.next(result);
                        return [2 /*return*/, acc];
                    }
                    if (!(arg_type === "FUNCTION")) return [3 /*break*/, 7];
                    temp = args(acc);
                    if (!checks_1.isPromise(temp)) return [3 /*break*/, 5];
                    return [4 /*yield*/, temp.catch(function (e) { return e; })];
                case 4:
                    _b = _f.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = temp;
                    _f.label = 6;
                case 6:
                    result = _b;
                    _f.label = 7;
                case 7:
                    // if object, send the Command as-is and spread into acc
                    if (arg_type === "OBJECT") {
                        if (!sub$)
                            return [2 /*return*/, __assign(__assign({}, acc), args)];
                        stream__js_1.command$.next(c);
                        return [2 /*return*/, __assign(__assign({}, acc), args)];
                    }
                    /* RESULT HANDLERS */
                    if (reso) {
                        // promise rejection handler
                        if (erro && result instanceof Error) {
                            error = erro(acc, result);
                            if (error.sub$)
                                return [2 /*return*/, stream__js_1.command$.next(error)];
                            console.warn(err_str, "[ Promise rejected ]:", result);
                            result = error;
                        }
                        // resovled promise handler
                        if (!(result instanceof Error)) {
                            resolved = reso(acc, result);
                            // resolved promise with no sub$ key -> spread
                            // resolved value into acc
                            if (resolved.sub$)
                                stream__js_1.command$.next(resolved);
                            else if (!sub$)
                                return [2 /*return*/, __assign(__assign({}, acc), resolved)];
                            result = resolved;
                        }
                        console.warn("no 'erro' (Error handler) set for " + c);
                    }
                    // no sub$ key & not a promise -> just spread into acc
                    if (!reso && !sub$)
                        return [2 /*return*/, __assign(__assign({}, acc), result)];
                    // error, but no error handler
                    if (result instanceof Error) {
                        console.warn(err_str, result);
                        return [2 /*return*/, acc];
                    }
                    if (result !== Object(result)) {
                        if (!sub$) {
                            nosub$_err(c, i);
                            return [2 /*return*/, acc];
                        }
                        // if the final result is primitive, you can't refer
                        // to this value in proceeding Commands -> send the
                        // Command as-is, return acc as-is.
                        stream__js_1.command$.next((_d = {}, _d[keys_js_1.CMD_SUB$] = sub$, _d[keys_js_1.CMD_ARGS] = result, _d));
                        return [2 /*return*/, acc];
                    }
                    // if the result has made it this far, send it along
                    // console.log(`${sub$} made it through`)
                    stream__js_1.command$.next((_e = {}, _e[keys_js_1.CMD_SUB$] = sub$, _e[keys_js_1.CMD_ARGS] = result, _e));
                    return [2 /*return*/, __assign(__assign({}, acc), result)];
            }
        });
    }); }, Promise.resolve({}));
};
