/**
 * @module components/FLIPkid
 */

import { FLIP_FIRST, FLIP_LAST_INVERSE_PLAY, HURL } from "../commands"

import { CFG_RUN$, CMD_ARGS } from "../keys.js"

const err_str = prop => `
  No '${prop}' property found on FLIPkid firstChild. 
  Ensure you are providing FLIPkid a component with an 
  attributes object as its second argument with a ${prop}
  property for proper FLIP routing.
`

// const [tag, attrs, ..._args] = kid(ctx, ...args)
// const { href } = attrs

const sim_event = href => ({
  currentTarget: { document: null },
  target: {
    href
  }
})

/**
 * FLIP (First Last Invert Play) Animating component. Wraps
 * a component that has an `href` attribute and uses it to
 * trigger a routing event and FLIP animation between
 * instances on separate routes (provides a "magic
 * move"-like UX)
 *
 */
export const FLIPkid = Object.freeze({
  render: (ctx, ...rest) =>
    // console.log("FLIPkid"),
    [
      "div",
      {
        onclick: ev => {
          ev.preventDefault()
          const target = ev.target
          const href = target.getAttribute("href")
          // console.log({ target, href })
          if (!href) return new Error(err_str("href"))
          ctx[CFG_RUN$]([
            { ...HURL, [CMD_ARGS]: sim_event(href) },
            { ...FLIP_FIRST, [CMD_ARGS]: { id: href, target } }
          ])
        }
      },
      ...rest
    ],
  init: (el, ctx) => {
    // console.log({
    //   el,
    //   firstChild: el.firstChild,
    //   id: el.firstChild.getAttribute("href")
    // }),
    ctx[CFG_RUN$]({
      ...FLIP_LAST_INVERSE_PLAY,
      [CMD_ARGS]: {
        element: el.firstChild,
        id: el.firstChild.getAttribute("href")
      }
    })
  }
})
