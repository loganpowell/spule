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
  ROUTE_LOADING_,
  ROUTE_PATH_,
  ROOT_,
  PAGE_TEMPLATE_,
  DOM_,
  URL_,
  sub$_,
  args_,
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
  FURL
} from "../keys.js"

import { $store$ } from "../store"

import { registerCMD } from "../commands/register.js"

import { _URL_DOM__ROUTE, _URL__ROUTE } from "../tasks"

import { fURL, diff_keys } from "../utils"

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

  const taskFrom = _URL_DOM__ROUTE(router)
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

  const taskFrom = _URL__ROUTE(router)
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
export const boot = CFG => {
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
        [FURL]: () =>
          // console.log({ fURL }),
          fURL(window.location.href, RGX), // <- 🔍
        ...others
      }
    })
  )
}
