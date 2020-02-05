/**
 * @module Routing
 * @format
 */
import { fURL } from "../utils"
import { DOMnavigated$ } from "../core/stream$.js"
import {
  DOM_,
  URL_,
  URL_path_,
  sub$_,
  args_,
  handler_
} from "../keys.js"

import { registerCMD } from "./register.js"
/**
 * we need to transform the payload to align with the
 * object structure of the native DOM events ('popstate'
 * and 'DOMContentLoaded') payloads, so they're
 * transformed correctly by the `navigated$` stream
 * transforms
 */
export const HURLer = ev => {
  // ev.preventDefault()
  // console.log({ e })
  let href = ev.target.href
  let w_href = window.location.href
  let parsed = fURL(w_href)
  let w_path = `/${parsed[URL_path_].join("/")}`
  // handle both absolute and root relative paths
  if (href === w_href || href === w_path) return

  DOMnavigated$.next({
    target: { location: { href } },
    currentTarget: ev.currentTarget
  })
  return ev
}

export const HURL = registerCMD({
  [sub$_]: "HURL",
  [args_]: ev => ev,
  [handler_]: HURLer
})

const setLinkAttrs = target => {
  document.body.querySelectorAll("a[visited]").forEach((el : HTMLLinkElement) => {
    if (el.href === window.location.href) el.setAttribute("active", "")
    else el.removeAttribute("active")
  })
  if (target.setAttribute) {
    target.setAttribute("visited", "")
    target.setAttribute("active", "")
  }
}

/**
 * ## `_SET_LINK_ATTRS_DOM`
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
export const __SET_LINK_ATTRS_DOM = registerCMD({
  [sub$_]: "__SET_LINK_ATTRS_DOM",
  [args_]: acc => ({ [DOM_]: acc[DOM_] }),
  [handler_]: args => setLinkAttrs(args[DOM_])
})

/**
 * ## `_HREF_PUSHSTATE_DOM`
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
export const __HREF_PUSHSTATE_DOM = registerCMD({
  [sub$_]: "__HREF_PUSHSTATE_DOM",
  [args_]: acc => ({ [URL_]: acc[URL_], [DOM_]: acc[DOM_] }),
  [handler_]: args =>
    !args[DOM_].document
      ? history.pushState(fURL(args[URL_]), null, args[URL_])
      : null
})

/**
 * ## `_NOTIFY_PRERENDER_DOM`
 *
 * ### Payload: static
 * default payload `args` signature
 * ```
 * args: true,
 * ```
 * ### Handler: side-effecting
 * Routing Command: DOM-specific (used for manually
 * triggering `rendertron` prerenderer for bots/web-crawlers
 *
 *
 * TODO: `jsdom` prerender testing
 *
 * basic `http` server that returns static content for
 * certain user-agents
 *
 * import { JSDOM } from "jsdom"
 *
 * const document = (new JSDOM(...)).window.document
 * document.addEventListener("rendered", () => {...scrape
 * stuff here...
 * })
 *
 *
 */
export const __NOTIFY_PRERENDER_DOM = registerCMD({
  [sub$_]: "__NOTIFY_PRERENDER_DOM",
  [args_]: true,
  //👀 for prerenderer,
  [handler_]: () => document.dispatchEvent(new Event("rendered"))
})
