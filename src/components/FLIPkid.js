/**
 * @module Components: FLIP
 * @format
 */

import { FLIP_FIRST, FLIP_LAST_INVERSE_PLAY, HURL } from "../commands"
import { run_, args_ } from "../store"

/**
 * There're only 3 lifecycle hooks. render is called for
 * every update and is just providing the actual hiccup for
 * that component. if that component is used the first time,
 * the order is normalizeTree ->  render -> diff ->  init.
 * The actual DOM element is only known when init is called,
 * NEVER during render (though you could cache it as local
 * component state). If during diffing it turns out the
 * component is not used anymore, then release will be
 * called
 *
 * if the object identity of your life cycle component
 * changes with every update then that count as full
 * replacement and would trigger init each time:
 *
 * https://github.com/thi-ng/umbrella/wiki/Higher-order-components
 *
 * init is called in so called "post-order", i.e. when it
 * executes all children are already present in the DOM (and
 * might have had their init hooks called) first time = 1st
 * frame the component appears in the DOM
 *
 */
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
          ctx[run_]([
            { ...HURL, [args_]: sim_event(href) },
            { ...FLIP_FIRST, [args_]: { id: href, target } }
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
    ctx[run_]({
      ...FLIP_LAST_INVERSE_PLAY,
      [args_]: {
        element: el.firstChild,
        id: el.firstChild.getAttribute("href")
      }
    })
  }
})
