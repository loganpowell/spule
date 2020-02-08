/**
 * @module Registration
 * @format
 */

import { fromAtom, sidechainPartition, fromRAF } from "@thi.ng/rstream"
import { peek } from "@thi.ng/arrays"
import { map } from "@thi.ng/transducers"
import { updateDOM } from "@thi.ng/transducers-hdom"
import { getIn } from "@thi.ng/paths"

import {
  DOM_NODE,
  ROUTE_LOAD,
  ROUTE_PATH,
  ROUTE_ROOT,
  ROUTE_VIEW,
  URL_FULL,
  URL_PRSE,
  ROUTER_PRFX,
  CFG_RUTR,
  CMD_SUB$,
  CMD_ARGS,
  CMD_SRC$,
  CMD_WORK,
  CFG_RUN$,
  CFG_STOR,
  CFG_ROOT,
  CFG_VIEW,
  CFG_DRFT,
  CFG_LOG$,
} from "../keys.js"

import { $store$ } from "../store"

import { registerCMD } from "../commands/register.js"

import { URL_DOM__ROUTE, URL__ROUTE } from "../tasks"

import { unFURL, diff_keys } from "../utils"

import { run$, DOMnavigated$ } from "./stream$.js"

/**
 *
 * expects payload of
 * ```
 * { target: { location: { href } }, currentTarget }
 * ```
 */
export const registerRouterDOM = router => {
  console.log("DOM Router Registered")

  const taskFrom = URL_DOM__ROUTE(router)
  return registerCMD({
    [CMD_SRC$]: DOMnavigated$,
    [CMD_SUB$]: "_URL_NAVIGATED$_DOM",
    [CMD_ARGS]: x => x,
    [CMD_WORK]: args =>
      run$.next(taskFrom({ [URL_FULL]: args[URL_FULL], [DOM_NODE]: args[DOM_NODE] }))
  })
}

// TODO: server router must be fed from `http` or something (req/res), not `DOMnavigated$`

// export const registerRouter = router => {
//   console.log("Router Registered")

//   const taskFrom = URL__ROUTE(router)
//   return registerCMD({
//     [CMD_SUB$]: "_URL_NAVIGATED$",
//     [CMD_SRC$]: DOMnavigated$,
//     [CMD_ARGS]: x => x,
//     [CMD_WORK]: args =>
//       run$.next(taskFrom({ [URL_FULL]: args[URL_FULL], [DOM_NODE]: args[DOM_NODE] }))
//   })
// }

const pre = (ctx, body) => (
  console.log(
    `no \`app\` component provided to \`${boot.name}({${CFG_VIEW}})\`. Rendering state by route path`
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
export const boot = CFG => {
  // console.log({ URL_page })

  const root = CFG[CFG_ROOT] || document.body
  const view = CFG[CFG_VIEW] || pre
  const draft = CFG[CFG_DRFT]
  const router = CFG[CFG_RUTR]
  const log$ = CFG[CFG_LOG$]

  const knowns = [CFG_ROOT, CFG_VIEW, CFG_DRFT, CFG_RUTR, CFG_LOG$]
  const [, others] = diff_keys(knowns, CFG)

  const escRGX = /[-/\\^$*+?.()|[\]{}]/g
  const escaped = string => string.replace(escRGX, "\\$&")

  const prfx = router[ROUTER_PRFX] || null
  const RGX = prfx ? new RegExp(escaped(prfx || ""), "g") : null

  if (router) registerRouterDOM(router)

  const state$ = fromAtom($store$)

  const shell = state$ => (
    log$ ? console.log(log$, state$) : null,
    state$[ROUTE_LOAD]
      ? null
      : [view, [state$[ROUTE_VIEW], getIn(state$, state$[ROUTE_PATH])]]
  )

  if (draft) $store$.swap(x => ({ ...draft, ...x }))

  $store$.resetIn(ROUTE_ROOT, root)

  state$.subscribe(sidechainPartition(fromRAF())).transform(
    map(peek),
    map(shell),
    updateDOM({
      root,
      span: false,
      ctx: {
        [CFG_RUN$]: x => run$.next(x),
        [CFG_STOR]: $store$,
        // remove any staging path components (e.g., gh-pages)
        [URL_PRSE]: () =>
          // console.log({ FURL }),
          unFURL(window.location.href, RGX), // <- 🔍
        ...others
      }
    })
  )
}
