/**
 * @module Registration
 * @format
 */

import { EquivMap } from "@thi.ng/associative"
import { map } from "@thi.ng/transducers"
import { isFunction } from "@thi.ng/checks"

import {
  CMD_SUB$,
  CMD_ARGS,
  CMD_RESO,
  CMD_ERRO,
  CMD_SRC$,
  CMD_WORK
} from "../keys.js"

// explicit import = prevent circular deps
import { command$, out$ } from "../core/stream$.js"

import { x_key_ERR, stringify_w_functions, diff_keys } from "../utils"


const feedCMD$fromSource$ = cmd => {
  const sub$ = cmd[CMD_SUB$]
  const args = cmd[CMD_ARGS]
  const args_is_fn = isFunction(args)
  const deliver = x => ({ [CMD_SUB$]: sub$, [CMD_ARGS]: args(x) })
  const delivery = { [CMD_SUB$]: sub$, [CMD_ARGS]: args }

  const feed = $ =>
    args_is_fn ? map(x => $.next(deliver(x))) : map(() => $.next(delivery))

  // looks for the `sub$` key to determine if its a command
  return cmd[CMD_SRC$].subscribe(feed(command$))
}


let registered = new EquivMap()
const err_str = "command Registration `registerCMD`"
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
export function registerCMD(command) {
  // 📌 TODO: register factory function

  const sub$ = command[CMD_SUB$]
  const args = command[CMD_ARGS]
  const erro = command[CMD_ERRO]
  const reso = command[CMD_RESO]
  const src$ = command[CMD_SRC$]
  const work = command[CMD_WORK]

  const knowns = [CMD_SUB$, CMD_ARGS, CMD_RESO, CMD_ERRO, CMD_SRC$, CMD_WORK]
  const [unknowns] = diff_keys(knowns, command)
  // console.log({ knowns, unknowns })

  /**
   * destructure the args component out of the emissions
   * to save the user from having to do that PITA everytime
   */
  if (unknowns.length > 0) {
    throw new Error(x_key_ERR(err_str, command, unknowns, sub$, undefined))
  }

  if (src$) feedCMD$fromSource$(command)

  // more: https://github.com/thi-ng/umbrella/blob/develop/examples/rstream-event-loop/src/events.ts
  // @ts-ignore
  out$.subscribeTopic(
    sub$,
    { next: work, error: console.warn },
    map(emissions => emissions[CMD_ARGS])
  )

  const CMD = reso
    ? { [CMD_SUB$]: sub$, [CMD_ARGS]: args, [CMD_RESO]: reso, [CMD_ERRO]: erro }
    : { [CMD_SUB$]: sub$, [CMD_ARGS]: args }
  // Set.add not supported by IE
  if (registered.set) {
    if (registered.has(sub$)) {
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
    registered.set(sub$, CMD)
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
