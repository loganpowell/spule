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
    const taskFrom = tasks_1._URL_DOM__ROUTE(router);
    return register_js_1.registerCMD({
        [keys_js_1.source$_]: stream__js_1.DOMnavigated$,
        [keys_js_1.sub$_]: "_URL_NAVIGATED$_DOM",
        [keys_js_1.args_]: x => x,
        [keys_js_1.handler_]: args => stream__js_1.run$.next(taskFrom({ [keys_js_1.URL_]: args[keys_js_1.URL_], [keys_js_1.DOM_]: args[keys_js_1.DOM_] }))
    });
};
exports.registerRouter = router => {
    console.log("Router Registered");
    const taskFrom = tasks_1._URL__ROUTE(router);
    return register_js_1.registerCMD({
        [keys_js_1.sub$_]: "_URL_NAVIGATED$",
        // 📌 TODO: add source for API access/server source$
        [keys_js_1.source$_]: stream__js_1.DOMnavigated$,
        [keys_js_1.args_]: x => x,
        [keys_js_1.handler_]: args => stream__js_1.run$.next(taskFrom({ [keys_js_1.URL_]: args[keys_js_1.URL_], [keys_js_1.DOM_]: args[keys_js_1.DOM_] }))
    });
};
const pre = (ctx, body) => (console.log(`no \`app\` component provided to \`${exports.boot.name}({${keys_js_1.app_}})\`. Rendering state by route path`),
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
/* ({
  root = document.body,
  app = pre,
  draft,
  router,
  trace,
  ...others
}) */
exports.boot = CFG => {
    // console.log({ URL_page })
    const _root = CFG[keys_js_1.root_] || document.body;
    const _app = CFG[keys_js_1.app_] || pre;
    const _draft = CFG[keys_js_1.draft_];
    const _router = CFG[keys_js_1.router_];
    const _trace = CFG[keys_js_1.trace_];
    const knowns = [keys_js_1.root_, keys_js_1.app_, keys_js_1.draft_, keys_js_1.router_, keys_js_1.trace_];
    const [, others] = utils_1.diff_keys(knowns, CFG);
    const escRGX = /[-/\\^$*+?.()|[\]{}]/g;
    const escaped = string => string.replace(escRGX, "\\$&");
    const _prefix = _router[keys_js_1.prefix_] || null;
    const RGX = _prefix ? new RegExp(escaped(_prefix || ""), "g") : null;
    if (_router)
        exports.registerRouterDOM(_router);
    const state$ = rstream_1.fromAtom(store_1.$store$);
    const shell = state$ => (_trace ? console.log(_trace, state$) : null,
        state$[keys_js_1.ROUTE_LOADING_]
            ? null
            : [_app, [state$[keys_js_1.PAGE_TEMPLATE_], paths_1.getIn(state$, state$[keys_js_1.ROUTE_PATH_])]]);
    if (_draft)
        store_1.$store$.swap(x => (Object.assign(Object.assign({}, _draft), x)));
    store_1.$store$.resetIn(keys_js_1.ROOT_, _root);
    state$.subscribe(rstream_1.sidechainPartition(rstream_1.fromRAF())).transform(transducers_1.map(arrays_1.peek), transducers_1.map(shell), transducers_hdom_1.updateDOM({
        root: _root,
        span: false,
        ctx: Object.assign({ [keys_js_1.run_]: x => stream__js_1.run$.next(x), [keys_js_1.state_]: store_1.$store$, 
            // remove any staging path components (e.g., gh-pages)
            [keys_js_1.FURL]: () => 
            // console.log({ fURL }),
            utils_1.fURL(window.location.href, RGX) }, others)
    }));
};
