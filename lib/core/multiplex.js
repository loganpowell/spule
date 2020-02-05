"use strict";
/**
 * @module multiplex
 * @format
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const checks_1 = require("@thi.ng/checks");
const keys_js_1 = require("../keys.js");
const utils_1 = require("../utils");
const stream__js_1 = require("./stream$.js");
const err_str = "Spooling Interupted"; // <- add doc link to error strings
const nosub$_err = (c, i) => console.warn(`
  🔥 No sub$ included for a Command with a primitive for 'args'. 
  🔥 Ergo, nothing was done with this Command: 
  
  ${JSON.stringify(c)}
  
  ${utils_1.key_index_err(c, i)}
  
  Hope that helps!
  `);
/**
 *
 * ## `multiplex`
 *
 * ### TL;DR:
 *
 * Handles Collections (array) of Commands ("Tasks") which
 * require _ordered_ choreography and/or have a dependency
 * on some (a)sync data produced by a user interaction.
 *
 * ### Synopsis:
 *
 * - Async `reduce` function, that passes an accumulator
 *   (`acc`) as a local state container between Command
 *   invocations.
 * - Commands are composed in-situ in userland (Ad hoc)
 * - spools a collection of Commands as a Task
 * - resolves any promises contained within a Command
 * - passes an accumulator (acc) to subsequent Commands in a
 *   Task
 *
 * ### Type checks on function signatures
 *
 * There are two valid forms for Task entries:
 * 1. a Unary function returning an array of Commands:
 *    referred to as "Subtasks"
 * 2. A Command object: dispatch to registered handlers
 *
 * ## Recognized Keys
 *
 * There are 4 recognized keys for a Command object:
 *
 * ### Primary keys
 *
 * ##### `sub$` key
 *
 * - Topic identifier: used for registering handlers hooked
 *    onto the Command stream.
 *
 * ##### `args` key
 *
 * - __primary control structure__ with three recognized
 *   forms that do different things in the context of a
 *   Task:
 * - non-function `args` (primitives, objects) send the args
 *   as-is to the Command handler
 * - nullary fns (`(0)=>` ) send the args_ as a Command to
 *   a `sub$` _stream_ of your choosing (ADVANCED: see
 *   Ad-hoc Stream Injection below)
 * - unary fns (`(1)=>`) are passed the inter-Task
 *   accumulated value, called and the resulting value is
 *   passed to registered Command handler
 * - Promises (and those returned from `(1)=>`) are resolved
 *   and their values sent to the handler
 * - new vals (Objects) are merged with accumulated object
 *   from preceding Task results(dupe keys overwritten)
 *
 * ### Promise-specific keys -> binary (as in two parameter,
 *   not boolean) functions:
 *
 * ##### `reso` key
 *
 * - (resolving) function `(2)=>` = handle resolved
 *   promises: MUST be a binary fn `(acc, resolved Promise)
 *   =>`
 *
 * ##### `erro` key
 *
 * - `(2)=>` = handle rejected promises: MUST be
 *   a binary fn `(acc, Promise rejection) =>`
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
 *
 * ```
 *
 * #### Use:
 * ```js
 * import { run$ } from "hurl"
 *
 * export const run = e => run$.next(e);
 *
 * //... 📌 TODO...
 * ```
 *
 * ### Ad-hoc stream injection
 *
 * ADVANCED USE ONLY 👽
 *
 * HURL tries to hide the stream implentation from the user
 * as much as possible, but allows you to go further down
 * the rabbit hole if so desired. You may send Commands to a
 * separate stream of your own creation during a Task by
 * using a nullary ("thunk") `(0)=>` function signature as
 * the `args` value of a Command. If this is the case, the
 * spool assumes the `sub$` key references a stream and
 * sends the return value of the thunk to that stream
 *
 * > Note: if you need to pass the accumulator to your
 * thunk, put it in a subtask, where you can
 * access/destructure the data from the acc passed into the
 * subtask function
 *
 * ```js
 * import { stream, trace } from "@thi.ng/rstream"
 *
 * // ad-hoc stream
 * let login = stream().subscribe(trace("login ->"))
 *
 * // task
 * let task = [
 *  { args: { href: "https://my.io/auth" } }, // <- no sub$, just pass data
 *  { sub$: login , args: () => "logging in..." },
 *  { sub$: "AUTH"
 *  , args: ({ href }) => fetch(href).then(r => r.json())
 *  , erro: (acc, err) => ({ sub$: "cancel", args: err })
 *  , reso: (acc, res) => ({ token: res }) },
 *  acc => subtask_login(acc),
 *  { sub$: login , args: () => "log in success" }
 * ]
 *
 * // subtask
 * let subtask_login = ({ token }) => [
 *  { sub$: login // <- stream
 *  , args: () => ({ token }) } // <- use acc
 * ]
 * ```
 *
 **/
exports.multiplex = task_array => task_array.reduce((a, c, i) => __awaiter(void 0, void 0, void 0, function* () {
    const acc = yield a;
    // console.log("ACCUMULATOR =>", acc)
    if (checks_1.isFunction(c)) {
        try {
            const recur = c(acc);
            // this ensures the accumulator is preserved between
            // stacks
            recur.unshift({ [keys_js_1.CMD_ARGS]: acc });
            return exports.multiplex(recur);
        }
        catch (e) {
            console.warn(err_str, e);
            return;
        }
    }
    const sub$ = c[keys_js_1.CMD_SUB$];
    const args = c[keys_js_1.CMD_ARGS];
    const erro = c[keys_js_1.CMD_ERRO];
    const reso = c[keys_js_1.CMD_RESO];
    // const _source$ = c[source$]
    // const _handler = c[handler]
    const knowns = [keys_js_1.CMD_SUB$, keys_js_1.CMD_ARGS, keys_js_1.CMD_RESO, keys_js_1.CMD_ERRO, keys_js_1.CMD_SRC$, keys_js_1.CMD_WORK];
    const [unknowns] = utils_1.diff_keys(knowns, c);
    if (unknowns.length > 0)
        throw new Error(utils_1.x_key_ERR(err_str, c, unknowns, sub$, i));
    const arg_type = utils_1.stringify_type(args);
    let result = args;
    /* RESOLVING ARGS */
    if (arg_type !== "PROMISE" && reso) {
        // if some signature needs to deal with both promises
        // and non-promises, non-promises are wrapped in a
        // Promise to "lift" them into the proper context for
        // handling
        result = Promise.resolve(args);
    }
    if (args !== Object(args) && !sub$) {
        nosub$_err(c, i);
        return acc;
    }
    if (arg_type === "PROMISE") {
        // result = await discardable(args).catch(e => e)
        result = yield args.catch(e => e);
    }
    if (arg_type === "THUNK") {
        // if thunk, dispatch to ad-hoc stream, return acc
        // as-is ⚠ this command will not be waited on
        result = args();
        console.log(`dispatching to ad-hoc stream: ${sub$.id}`);
        sub$.next(result); // 💃
        return acc;
    }
    if (arg_type === "FUNCTION") {
        // if function, call it with acc and resolve any
        // promises
        let temp = args(acc);
        // result = isPromise(temp) ? await discardable(temp).catch(e => e) : temp
        result = checks_1.isPromise(temp) ? yield temp.catch(e => e) : temp;
    }
    if (arg_type === "OBJECT") {
        // if object, send the Command as-is and spread into
        // acc
        if (!sub$)
            return Object.assign(Object.assign({}, acc), args);
        stream__js_1.command$.next(c);
        return Object.assign(Object.assign({}, acc), args);
    }
    /* RESULT HANDLERS */
    if (reso) {
        // promise rejection handler
        if (erro && (result instanceof Error)) {
            let error = erro(acc, result);
            if (error.sub$)
                return stream__js_1.command$.next(error);
            console.warn(err_str, "[ Promise rejected ]:", result);
            result = error;
        }
        // resovled promise handler
        if (!(result instanceof Error)) {
            let resolved = reso(acc, result);
            if (resolved.sub$)
                stream__js_1.command$.next(resolved);
            // resolved promise with no sub$ key -> spread
            // resolved value into acc
            else if (!sub$)
                return Object.assign(Object.assign({}, acc), resolved);
            result = resolved;
        }
        console.warn(`no 'erro' (Error handler) set for ${c}`);
    }
    // no sub$ key & not a promise -> just spread into acc
    if (!reso && !sub$)
        return Object.assign(Object.assign({}, acc), result);
    // error, but no error handler
    if (result instanceof Error) {
        console.warn(err_str, result);
        return acc;
    }
    if (result !== Object(result)) {
        if (!sub$) {
            nosub$_err(c, i);
            return acc;
        }
        // if the final result is primitive, you can't refer
        // to this value in proceeding Commands -> send the
        // Command as-is, return acc as-is.
        stream__js_1.command$.next({ [keys_js_1.CMD_SUB$]: sub$, [keys_js_1.CMD_ARGS]: result });
        return acc;
    }
    // if the result has made it this far, send it along
    // console.log(`${sub$} made it through`)
    stream__js_1.command$.next({ [keys_js_1.CMD_SUB$]: sub$, [keys_js_1.CMD_ARGS]: result });
    return Object.assign(Object.assign({}, acc), result);
}), Promise.resolve({}));
