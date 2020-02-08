"use strict";
/**
 * @module Registration
 * @format
 */
Object.defineProperty(exports, "__esModule", { value: true });
const rstream_1 = require("@thi.ng/rstream");
const arrays_1 = require("@thi.ng/arrays");
const transducers_1 = require("@thi.ng/transducers");
const transducers_hdom_1 = require("@thi.ng/transducers-hdom");
const paths_1 = require("@thi.ng/paths");
const keys_js_1 = require("../keys.js");
const store_1 = require("../store");
const register_js_1 = require("../commands/register.js");
const tasks_1 = require("../tasks");
const utils_1 = require("../utils");
const stream__js_1 = require("./stream$.js");
/**
 *
 * expects payload of
 * ```
 * { target: { location: { href } }, currentTarget }
 * ```
 */
exports.registerRouterDOM = router => {
    console.log("DOM Router Registered");
    const taskFrom = tasks_1.URL_DOM__ROUTE(router);
    return register_js_1.registerCMD({
        [keys_js_1.CMD_SRC$]: stream__js_1.DOMnavigated$,
        [keys_js_1.CMD_SUB$]: "_URL_NAVIGATED$_DOM",
        [keys_js_1.CMD_ARGS]: x => x,
        [keys_js_1.CMD_WORK]: args => stream__js_1.run$.next(taskFrom({ [keys_js_1.URL_FULL]: args[keys_js_1.URL_FULL], [keys_js_1.DOM_NODE]: args[keys_js_1.DOM_NODE] }))
    });
};
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
const pre = (ctx, body) => (console.log(`no \`app\` component provided to \`${exports.boot.name}({${keys_js_1.CFG_VIEW}})\`. Rendering state by route path`),
    ["pre", JSON.stringify(body[1], null, 2)]);
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
exports.boot = CFG => {
    // console.log({ URL_page })
    const root = CFG[keys_js_1.CFG_ROOT] || document.body;
    const view = CFG[keys_js_1.CFG_VIEW] || pre;
    const draft = CFG[keys_js_1.CFG_DRFT];
    const router = CFG[keys_js_1.CFG_RUTR];
    const log$ = CFG[keys_js_1.CFG_LOG$];
    const knowns = [keys_js_1.CFG_ROOT, keys_js_1.CFG_VIEW, keys_js_1.CFG_DRFT, keys_js_1.CFG_RUTR, keys_js_1.CFG_LOG$];
    const [, others] = utils_1.diff_keys(knowns, CFG);
    const escRGX = /[-/\\^$*+?.()|[\]{}]/g;
    const escaped = string => string.replace(escRGX, "\\$&");
    const prfx = router[keys_js_1.ROUTER_PRFX] || null;
    const RGX = prfx ? new RegExp(escaped(prfx || ""), "g") : null;
    if (router)
        exports.registerRouterDOM(router);
    const state$ = rstream_1.fromAtom(store_1.$store$);
    const shell = state$ => (log$ ? console.log(log$, state$) : null,
        state$[keys_js_1.ROUTE_LOAD]
            ? null
            : [view, [state$[keys_js_1.ROUTE_VIEW], paths_1.getIn(state$, state$[keys_js_1.ROUTE_PATH])]]);
    if (draft)
        store_1.$store$.swap(x => ({ ...draft, ...x }));
    store_1.$store$.resetIn(keys_js_1.ROUTE_ROOT, root);
    state$.subscribe(rstream_1.sidechainPartition(rstream_1.fromRAF())).transform(transducers_1.map(arrays_1.peek), transducers_1.map(shell), transducers_hdom_1.updateDOM({
        root,
        span: false,
        ctx: {
            [keys_js_1.CFG_RUN$]: x => stream__js_1.run$.next(x),
            [keys_js_1.CFG_STOR]: store_1.$store$,
            // remove any staging path components (e.g., gh-pages)
            [keys_js_1.URL_PRSE]: () => 
            // console.log({ FURL }),
            utils_1.unFURL(window.location.href, RGX),
            ...others
        }
    }));
};
