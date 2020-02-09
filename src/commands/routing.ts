/**
 * @module commands/routing
 */
import { parse } from "../utils"
import { DOMnavigated$ } from "../core/stream$.js"
import {
  DOM_NODE,
  URL_FULL,
  URL_PATH,
  CMD_SUB$,
  CMD_ARGS,
  CMD_WORK
} from "../keys.js"

import { registerCMD } from "./register.js"

/**
 * Click handler that mimics DOM navigation by transforming
 * a click event payload to align with the object structure
 * of the native DOM navigation events ('popstate' and
 * 'DOMContentLoaded') payloads, so they can be consumed by
 * the `navigated$` stream
 */

export const HURLer = ev => {
  // ev.preventDefault()
  // console.log({ e })
  const href = ev.target.href

  const w_href = window.location.href
  const parsed = parse(w_href)
  const w_path = `/${parsed[URL_PATH].join("/")}`
  // handle both absolute and root relative paths
  if (href === w_href || href === w_path) return

  DOMnavigated$.next({
    target: { location: { href } },
    currentTarget: ev.currentTarget
  })
  return ev
}

export const HURL = registerCMD({
  [CMD_SUB$]: "_HURL",
  [CMD_ARGS]: ev => ev,
  [CMD_WORK]: HURLer
})

const setLinkAttrs = target => {
  document.body
    .querySelectorAll("a[visited]")
    .forEach((el: HTMLLinkElement) => {
      if (el.href === window.location.href) el.setAttribute("active", "")
      else el.removeAttribute("active")
    })
  if (target.setAttribute) {
    target.setAttribute("visited", "")
    target.setAttribute("active", "")
  }
}

/**
 *
 * Routing Command: DOM-specific
 *
 * ### Payload: function
 * default payload `args` signature:
 * ```
 * args: ({ DOM }) => ({ DOM }),
 * ```
 * Input = DOM node reference
 *
 * ### Handler: side-effecting
 * Takes a DOM reference and queries all visited links. Sets
 * current/clicked link as active and sets visted links that
 * don't match current URL to inactive see `setLinkAttrs`
 * function
 *
 */
export const SET_LINK_ATTRS_DOM = registerCMD({
  [CMD_SUB$]: "_SET_LINK_ATTRS_DOM",
  [CMD_ARGS]: acc => ({ [DOM_NODE]: acc[DOM_NODE] }),
  [CMD_WORK]: args => setLinkAttrs(args[DOM_NODE])
})

/**
 *
 * Routing Command: DOM-specific
 *
 * ### Payload: function
 * default payload `args` signature:
 * ```
 * args: ({ URL, DOM }) => ({ URL, DOM }),
 * ```
 * Takes a URL and a DOM reference
 *
 * ### Handler: side-effecting
 * If the DOM reference is an `<a>` element, uses
 * `history.pushState` to add the clicked URL (plus the
 * parsed URL from `parse_URL(URL)`) to the `history` object
 *
 * export const DOMnavigated$ = merge({
 *   src: [popstate$, DOMContentLoaded$]
 * }).transform(map(x => ({ URL: x.target.location.href, DOM: x.currentTarget })))
 *
 *
 */
export const HREF_PUSHSTATE_DOM = registerCMD({
  [CMD_SUB$]: "_HREF_PUSHSTATE_DOM",
  [CMD_ARGS]: acc => ({ [URL_FULL]: acc[URL_FULL], [DOM_NODE]: acc[DOM_NODE] }),
  [CMD_WORK]: args =>
    !args[DOM_NODE].document
      ? history.pushState(parse(args[URL_FULL]), null, args[URL_FULL])
      : null
})

/**
 *
 * ### args: static
 *
 * ### work: side-effecting
 *
 * Routing Command: DOM-specific (used for manually
 * triggering a prerendering server for bots/web-crawlers
 *
 * TODO: `jsdom` prerender testing
 *
 * basic `http` server that returns static content for
 * certain user-agents
 *
 * import { JSDOM } from "jsdom"
 *
 * const document = (new JSDOM(...)).window.document
 * document.addEventListener("rendered",
 *  () => {...scrape stuff here... }
 * )
 *
 *
 */
export const NOTIFY_PRERENDER_DOM = registerCMD({
  [CMD_SUB$]: "_NOTIFY_PRERENDER_DOM",
  [CMD_ARGS]: true,
  //👀 for prerenderer,
  [CMD_WORK]: () => document.dispatchEvent(new Event("rendered"))
})
