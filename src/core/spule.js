/**
 * @module Core
 * @format
 */

import { isFunction, isPromise } from "@thi.ng/checks"
import { fromDOMEvent, merge, pubsub } from "@thi.ng/rstream"
import { map } from "@thi.ng/transducers"

import {
  stringify_type,
  x_key_ERR,
  key_index_err,
  diff_keys,
  sub$_,
  args_,
  reso_,
  erro_,
  source$_,
  handler_,
  URL_,
  DOM_
} from "../api"

/**
 * # Stream Architecture:
 *
 * `run$` is the primary event stream exposed to the user
 * via the `ctx` object injected into every `hdom` component
 * the command stream is the only way the user changes
 * anything in `hurl`
 *
 * ## Marble Diagram
 *
 * ```
 * 0>- |------c-----------c--[~a~b~a~]-a----c-> : calls
 * 1>- |ps|---1-----------1----------0-1----1-> : run$
 * 2>- |t0|---------a~~b~~~~~~~~~~~a~*--------> : task$
 * 3>- |t1|---c-----------c------------a----c-> : command$
 * 4>- ---|ps|c-----a--b--c--------a---a----c-> : out$
 * Handlers
 * a>- ---|ta|------*--------------*---*------> : registerCMD
 * b>- ---|tb|---------*----------------------> : registerCMD
 * c>- ---|tc|*-----------*-----------------*-> : registerCMD
 * ```
 *
 * ## Streams
 *
 * - `0>-`: `ctx.run$.next(x)` userland dispatches
 * - `1>-`: `pubsub({ topic: x => x.length === 0 })` `run$`
 *   stream
 * - `2>-`: pubsub = `false` ? -> `task$` stream
 * - `3>-`: pubsub = `true` ? ->`command$` stream
 * - `4>-`: `pubsub({ topic: x => x.sub$ })`: `out$` stream
 *   -> `register_command`
 *
 * ## Handlers
 *
 * `4>-` this is the stream to which the user (and
 * framework) attaches handlers. Handlers receive events
 * they subscribe to as topics based on a `sub$` key in a
 * Command object.
 *
 * ### Handlers (framework provided):
 * - "state": Global state mutations
 * - "route": Routing
 * - "FLIP" :
 *   [F.L.I.P.](https://aerotwist.com/blog/flip-your-animations/)
 *   animations
 *
 * TODO:
 * - add __Examples__
 * - add `beforeunload` event handler within #4 (orphan):
 *    SEE https://youtu.be/QQukWZcIptM
 * - enable ctx.run.cancel() via external or internal events
 *    (e.g., popstate / { sub$:  "cancel" })
 *
 * ## `run$`
 *
 * User-land event dispatch stream
 *
 * This stream is directly exposed to users via `ctx` Any
 * one-off Commands `next`ed into this stream are sent to
 * the `command$` stream. Arrays of Commands (Tasks) are
 * sent to the `task$` stream.
 *
 */
export const run$ = pubsub({
  topic: x => !!x.sub$,
  id: "run$_stream",
  equiv: (x, y) => x === y || y === "_TRACE_STREAM"
})

/**
 * ## `out$`
 *
 * Primary user-land _READ_ stream. For attaching handlers
 * for responding to emmitted Commands
 *
 */
export const out$ = pubsub({
  topic: x => x.sub$,
  id: "out$_stream",
  equiv: (x, y) => x === y || y === "_TRACE_STREAM"
})

/**
 * ## `command$`
 *
 * Primary fork/bisect stream for indivual commands.
 * attached to a `pubsub` stemming from this stream. The
 * `topic` function used to alert downstream handlers is a
 * simple lookup of the `sub$` key of the command
 *
 */
export const command$ = run$.subscribeTopic(
  true,
  {
    next: x => out$.next(x),
    error: console.warn
  },
  { id: "command$_stream" }
)

export const popstate$ = fromDOMEvent(window, "popstate")
export const DOMContentLoaded$ = fromDOMEvent(window, "DOMContentLoaded")

// example of custom stream dispatch (logging)
/**
 *
 * There are three types of navigation we need to handle:
 * 1. DOMContentLoaded (entering the site) events
 * 2. popstate (browser back/forward button clicks) events
 * 3. `<a hurl="x">` (link clicking)
 *
 * These events have different payloads and need to be
 * harmonized in order to use them consistently
 *
 * ## getting the `hurl` property from the various events:
 * 1. ev.target.location.hurl
 * 2. ev.target.location.hurl
 * 3. ev.target.hurl
 *
 * for raw events, we can just transform them, but for link
 * clicking we need to convert/wrap it to align with the
 * destructuring of the others
 *
 * see _HURL in `/commands/routing.js` for ad-hoc stream
 * injection example
 */
export const DOMnavigated$ = merge({
  src: [popstate$, DOMContentLoaded$]
}).transform(
  map(x => ({ [URL_]: x.target.location.href, [DOM_]: x.currentTarget }))
)

const err_str = "Spooling Interupted" // <- add doc link to error strings

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
export const multiplex = task_array =>
  task_array.reduce(async (a, c, i) => {
    const acc = await a
    // console.log("ACCUMULATOR =>", acc)
    if (isFunction(c)) {
      try {
        const recur = c(acc)
        // this ensures the accumulator is preserved between
        // stacks
        recur.unshift({ [args_]: acc })
        return multiplex(recur)
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

/**
 * ## `task$`
 *
 * Batch processing stream, listens for Tasks sent as an
 * array of Commands (including subtask functions)
 *
 * stream (if array of event objects)
 *
 */
export const task$ = run$.subscribeTopic(
  false,
  {
    next: multiplex,
    error: console.warn
  },
  { id: "task$_stream" }
)
