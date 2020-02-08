"use strict";
/**
 * @module FLIP
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const keys_js_1 = require("../keys.js");
const err_str = prop => `
  No '${prop}' property found on FLIPkid firstChild. 
  Ensure you are providing FLIPkid a component with an 
  attributes object as its second argument with a ${prop}
  property for proper FLIP routing.
`;
// const [tag, attrs, ..._args] = kid(ctx, ...args)
// const { href } = attrs
const sim_event = href => ({
    currentTarget: { document: null },
    target: {
        href
    }
});
/**
 * FLIP (First Last Invert Play) Animating component. Wraps
 * a component that has an `href` attribute and uses it to
 * trigger a routing event and FLIP animation between
 * instances on separate routes (provides a "magic
 * move"-like UX)
 *
 */
exports.FLIPkid = Object.freeze({
    render: (ctx, ...rest) => 
    // console.log("FLIPkid"),
    [
        "div",
        {
            onclick: ev => {
                ev.preventDefault();
                const target = ev.target;
                const href = target.getAttribute("href");
                // console.log({ target, href })
                if (!href)
                    return new Error(err_str("href"));
                ctx[keys_js_1.CFG_RUN$]([
                    { ...commands_1.HURL, [keys_js_1.CMD_ARGS]: sim_event(href) },
                    { ...commands_1.FLIP_FIRST, [keys_js_1.CMD_ARGS]: { id: href, target } }
                ]);
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
        ctx[keys_js_1.CFG_RUN$]({
            ...commands_1.FLIP_LAST_INVERSE_PLAY,
            [keys_js_1.CMD_ARGS]: {
                element: el.firstChild,
                id: el.firstChild.getAttribute("href")
            }
        });
    }
});
