/**
 * @module Core
 * @format
 */

import { isFunction, isPromise } from "@thi.ng/checks"
import { stringify_type, x_key_ERR, key_index_err, diff_keys } from "../utils"
import { command$ } from "../streams"
import { sub$_, args_, reso_, erro_, source$_, handler_ } from "../store"

const err_str = "Spool Interupted" // <- add doc link to error strings

const nosub$_err = (c, i) =>
  console.warn(`
  🔥 No sub$ included for a Command with a primitive for 'args'. 
  🔥 Ergo, nothing was done with this Command: 
  
  ${JSON.stringify(c)}
  
  ${key_index_err(c, i)}
  
  Hope that helps!
  `)

/**
 *
 * ## `spool`
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
export const spule = task_array =>
  task_array.reduce(async (a, c, i) => {
    const acc = await a
    // console.log("ACCUMULATOR =>", acc)
    if (isFunction(c)) {
      try {
        const recur = c(acc)
        // this ensures the accumulator is preserved between
        // stacks
        recur.unshift({ [args_]: acc })
        return spule(recur)
      } catch (e) {
        console.warn(err_str, e)
        return
      }
    }
    const sub$ = c[sub$_]
    const args = c[args_]
    const erro = c[erro_]
    const reso = c[reso_]
    // const _source$ = c[source$]
    // const _handler = c[handler]
    const knowns = [sub$_, args_, reso_, erro_, source$_, handler_]
    const [unknowns] = diff_keys(knowns, c)

    if (unknowns.length > 0)
      throw new Error(x_key_ERR(err_str, c, unknowns, sub$, i))
    const arg_type = stringify_type(args)

    let result = args

    /* RESOLVING ARGS */
    if (arg_type !== "PROMISE" && reso) {
      // if some signature needs to deal with both promises
      // and non-promises, non-promises are wrapped in a
      // Promise to "lift" them into the proper context for
      // handling
      result = Promise.resolve(args)
    }
    if (args !== Object(args) && !sub$) {
      nosub$_err(c, i)
      return acc
    }
    if (arg_type === "PROMISE") {
      // result = await discardable(args).catch(e => e)
      result = await args.catch(e => e)
    }
    if (arg_type === "THUNK") {
      // if thunk, dispatch to ad-hoc stream, return acc
      // as-is ⚠ this command will not be waited on
      result = args()
      console.log(`dispatching to ad-hoc stream: ${sub$.id}`)
      sub$.next(result) // 💃
      return acc
    }
    if (arg_type === "FUNCTION") {
      // if function, call it with acc and resolve any
      // promises
      let temp = args(acc)
      // result = isPromise(temp) ? await discardable(temp).catch(e => e) : temp
      result = isPromise(temp) ? await temp.catch(e => e) : temp
    }

    if (arg_type === "OBJECT") {
      // if object, send the Command as-is and spread into
      // acc
      if (!sub$) return { ...acc, ...args }
      command$.next(c)
      return { ...acc, ...args }
    }

    /* RESULT HANDLERS */
    if (reso) {
      // promise rejection handler
      if (erro & (result instanceof Error)) {
        let error = erro_(acc, result)
        if (error.sub$) return command$.next(error)
        console.warn(err_str, "[ Promise rejected ]:", result)
        result = error
      }
      // resovled promise handler
      if (!(result instanceof Error)) {
        let resolved = reso(acc, result)
        if (resolved.sub$) command$.next(resolved)
        // resolved promise with no sub$ key -> spread
        // resolved value into acc
        else if (!sub$) return { ...acc, ...resolved }
        result = resolved
      }
      console.warn(`no 'erro' (Error handler) set for ${c}`)
    }
    // no sub$ key & not a promise -> just spread into acc
    if (!reso && !sub$) return { ...acc, ...result }

    // error, but no error handler
    if (result instanceof Error) {
      console.warn(err_str, result)
      return acc
    }
    if (result !== Object(result)) {
      if (!sub$) {
        nosub$_err(c, i)
        return acc
      }
      // if the final result is primitive, you can't refer
      // to this value in proceeding Commands -> send the
      // Command as-is, return acc as-is.
      command$.next({ [sub$_]: sub$, [args_]: result })
      return acc
    }
    // if the result has made it this far, send it along
    // console.log(`${sub$} made it through`)
    command$.next({ [sub$_]: sub$, [args_]: result })
    return { ...acc, ...result }
  }, Promise.resolve({}))
