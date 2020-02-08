"use strict";
/**
 * @module multiplex
 * @format
 */
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
exports.multiplex = task_array => task_array.reduce(async (a, c, i) => {
    const acc = await a;
    // console.log("ACCUMULATOR =>", acc)
    if (checks_1.isFunction(c)) {
        try {
            const recur = c(acc);
            // ensures accumulator is preserved between stacks
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
        throw new Error(utils_1.xKeyError(err_str, c, unknowns, sub$, i));
    const arg_type = utils_1.stringify_type(args);
    let result = args;
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
        return acc;
    }
    if (arg_type === "PROMISE") {
        // result = await discardable(args).catch(e => e)
        result = await args.catch(e => e);
    }
    if (arg_type === "THUNK") {
        // if thunk, dispatch to ad-hoc stream, return acc
        // as-is ⚠ this command will not be waited on
        result = args();
        console.log(`dispatching to ad-hoc stream: ${sub$.id}`);
        sub$.next(result);
        return acc;
    }
    // if function, call it with acc and resolve any Promises
    if (arg_type === "FUNCTION") {
        let temp = args(acc);
        result = checks_1.isPromise(temp) ? await temp.catch(e => e) : temp;
    }
    // if object, send the Command as-is and spread into acc
    if (arg_type === "OBJECT") {
        if (!sub$)
            return { ...acc, ...args };
        stream__js_1.command$.next(c);
        return { ...acc, ...args };
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
            // resolved promise with no sub$ key -> spread
            // resolved value into acc
            if (resolved.sub$)
                stream__js_1.command$.next(resolved);
            else if (!sub$)
                return { ...acc, ...resolved };
            result = resolved;
        }
        console.warn(`no 'erro' (Error handler) set for ${c}`);
    }
    // no sub$ key & not a promise -> just spread into acc
    if (!reso && !sub$)
        return { ...acc, ...result };
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
    return { ...acc, ...result };
}, Promise.resolve({}));
