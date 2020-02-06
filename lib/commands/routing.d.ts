/**
 * Click handler that mimics DOM navigation by transforming
 * a click event payload to align with the object structure
 * of the native DOM navigation events ('popstate' and
 * 'DOMContentLoaded') payloads, so they can be consumed by
 * the `navigated$` stream
 */
export declare const HURLer: (ev: any) => any;
export declare const HURL: {
    [x: string]: any;
};
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
export declare const SET_LINK_ATTRS_DOM: {
    [x: string]: any;
};
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
export declare const HREF_PUSHSTATE_DOM: {
    [x: string]: any;
};
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
export declare const NOTIFY_PRERENDER_DOM: {
    [x: string]: any;
};
