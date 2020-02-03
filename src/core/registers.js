/**
 * @module Registration
 * @format
 */

import { fromAtom, sidechainPartition, fromRAF } from "@thi.ng/rstream"
import { EquivMap } from "@thi.ng/associative"
import { peek } from "@thi.ng/arrays"
import { map } from "@thi.ng/transducers"
import { updateDOM } from "@thi.ng/transducers-hdom"
import { isFunction } from "@thi.ng/checks"
import { getIn } from "@thi.ng/paths"

import {
  $store$,
  ROUTE_LOADING_,
  ROUTE_PATH_,
  ROOT_,
  PAGE_TEMPLATE_,
  DOM_,
  URL_,
  sub$_,
  args_,
  reso_,
  erro_,
  prefix_,
  source$_,
  handler_,
  run_,
  state_,
  root_,
  app_,
  router_,
  draft_,
  trace_,
  __URL_DOM__ROUTE,
  __URL__ROUTE,
  x_key_ERR,
  fURL,
  stringify_w_functions,
  diff_keys,
  command$,
  out$,
  run$,
  DOMnavigated$
} from "../_api"

const err_str = "registerCMD"

const feedCMD$fromSource$ = cmd => {
  const _sub$ = cmd[sub$_]
  const _args = cmd[args_]
  const args_is_fn = isFunction(_args)
  const deliver = x => ({ [sub$_]: _sub$, [args_]: _args(x) })
  const delivery = { [sub$_]: _sub$, [args_]: _args }

  const feed = $ =>
    args_is_fn ? map(x => $.next(deliver(x))) : map(() => $.next(delivery))

  // looks for the `sub$` key to determine if its a command
  return cmd[source$_].subscribe(feed(command$))
}

// const feedCMD$fromSource$ = ({ sub$, args, source$ }) => {
//   let args_is_fn = isFunction(args)
//   let deliver = x => ({ sub$, args: args(x) })
//   let delivery = { sub$, args }

//   let feed = $ =>
//     args_is_fn ? map(x => $.next(deliver(x))) : map(() => $.next(delivery))

//   // looks for the `sub$` key to determine if its a command
//   return source$.subscribe(feed(command$))
// }

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
let registered = new EquivMap()

export function registerCMD(command) {
  // 📌 TODO: register factory function

  const _sub$ = command[sub$_]
  const _args = command[args_]
  const _erro = command[erro_]
  const _reso = command[reso_]
  const _source$ = command[source$_]
  const _handler = command[handler_]

  const knowns = [sub$_, args_, reso_, erro_, source$_, handler_]
  const [unknowns] = diff_keys(knowns, command)
  // console.log({ knowns, unknowns })

  /**
   * destructure the args component out of the emissions
   * to save the user from having to do that PITA everytime
   */
  if (unknowns.length > 0) {
    throw new Error(x_key_ERR(err_str, command, unknowns, _sub$, undefined))
  }

  if (_source$) feedCMD$fromSource$(command)

  // more: https://github.com/thi-ng/umbrella/blob/develop/examples/rstream-event-loop/src/events.ts
  out$.subscribeTopic(
    _sub$,
    { next: _handler, error: console.warn },
    map(emissions => emissions[args_])
  )
  const CMD = _reso
    ? { [sub$_]: _sub$, [args_]: _args, [reso_]: _reso, [erro_]: _erro }
    : { [sub$_]: _sub$, [args_]: _args }
  // Set.add not supported by IE
  if (registered.set) {
    if (registered.has(_sub$)) {
      throw new Error(
        `

🔥 duplicate \`sub$\` value detected in Command:
${stringify_w_functions(CMD)}
existing registered Commands:
${JSON.stringify([...registered.keys()], null, 2)}
🔥 Please use a different/unique Command \`sub$\` string

🔎 Inspect existing Commands using js Map API \`registerCMD.all\`
🔎 (\`registerCMD.all.entries()\`, \`registerCMD.all.has("X")\`, etc.)

        `
      )
    }
    registered.set(_sub$, CMD)
  }
  return CMD
}
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
registerCMD.all = registered

/**
 *
 * expects payload of
 * ```
 * { target: { location: { href } }, currentTarget }
 * ```
 */
export const registerRouterDOM = router => {
  console.log("DOM Router Registered")

  const taskFrom = __URL_DOM__ROUTE(router)
  return registerCMD({
    [source$_]: DOMnavigated$,
    [sub$_]: "_URL_NAVIGATED$_DOM",
    [args_]: x => x,
    [handler_]: args =>
      run$.next(taskFrom({ [URL_]: args[URL_], [DOM_]: args[DOM_] }))
  })
}

export const registerRouter = router => {
  console.log("Router Registered")

  const taskFrom = __URL__ROUTE(router)
  return registerCMD({
    [sub$_]: "_URL_NAVIGATED$",
    // 📌 TODO: add source for API access/server source$
    [source$_]: DOMnavigated$,
    [args_]: x => x,
    [handler_]: args =>
      run$.next(taskFrom({ [URL_]: args[URL_], [DOM_]: args[DOM_] }))
  })
}

const pre = (ctx, body) => (
  console.log(
    `no \`app\` component provided to \`${boot.name}({${app_}})\`. Rendering state by route path`
  ),
  ["pre", JSON.stringify(body[1], null, 2)]
)
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
export const boot = async CFG => {
  // console.log({ URL_page })

  const _root = CFG[root_] || document.body
  const _app = CFG[app_] || pre
  const _draft = CFG[draft_]
  const _router = CFG[router_]
  const _trace = CFG[trace_]

  const knowns = [root_, app_, draft_, router_, trace_]
  const [, others] = diff_keys(knowns, CFG)

  const escRGX = /[-/\\^$*+?.()|[\]{}]/g
  const escaped = string => string.replace(escRGX, "\\$&")

  const _prefix = _router[prefix_] || null
  const RGX = _prefix ? new RegExp(escaped(_prefix || ""), "g") : null

  if (_router) registerRouterDOM(_router)

  const state$ = fromAtom($store$)

  const shell = state$ => (
    _trace ? console.log(_trace, state$) : null,
    state$[ROUTE_LOADING_]
      ? null
      : [_app, [state$[PAGE_TEMPLATE_], getIn(state$, state$[ROUTE_PATH_])]]
  )

  if (_draft) $store$.swap(x => ({ ..._draft, ...x }))

  $store$.resetIn(ROOT_, _root)

  state$.subscribe(sidechainPartition(fromRAF())).transform(
    map(peek),
    map(shell),
    updateDOM({
      root: _root,
      span: false,
      ctx: {
        [run_]: x => run$.next(x),
        [state_]: $store$,
        // remove any staging path components (e.g., gh-pages)
        [fURL.name]: () =>
          // console.log({ fURL }),
          fURL(window.location.href, RGX), // <- 🔍
        ...others
      }
    })
  )
}
