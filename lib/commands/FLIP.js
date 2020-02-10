"use strict";
/**
 * @module commands/FLIP
 */
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var atom_1 = require("@thi.ng/atom");
var paths_1 = require("@thi.ng/paths");
var keys_1 = require("../keys");
var register_1 = require("./register");
function getStyles(element) {
    var computedStyle = getComputedStyle(element);
    return {
        radius: computedStyle.borderRadius || 0
    };
}
function getRect(element, frame) {
    var _a = element.getBoundingClientRect(), top = _a.top, bottom = _a.bottom, left = _a.left, right = _a.right, width = _a.width, height = _a.height;
    var parent = frame ? frame.getBoundingClientRect() : null;
    return {
        top: top - (parent ? parent.top : 0),
        bottom: bottom,
        left: left - (parent ? parent.left : 0),
        right: right,
        width: width,
        height: height,
        get transform() {
            return getComputedStyle(element).transform || undefined;
        }
    };
}
// const w = window
// const d = document
// const e = d.documentElement
// const b = d.getElementsByTagName('body')[0]
// const proxy = {
//   top: window.
// }
var S_path = "FLIP_shuffle";
var shuffle_paths = function (uid) { return ({
    rects: [S_path, "rects", uid],
    elems: [S_path, "elems", uid]
}); };
var FLIP_all = function (el, state, uid, frameDOMel) {
    if (frameDOMel === void 0) { frameDOMel = null; }
    var rects = shuffle_paths(uid).rects;
    if (!paths_1.getIn(state.deref(), rects))
        return state.resetIn(rects, getRect(el, frameDOMel));
    var F_flip_map = paths_1.getIn(state.deref(), rects);
    var L_flip_map = getRect(el, frameDOMel);
    // console.log({ F_flip_map, L_flip_map })
    var Tx = F_flip_map.left - L_flip_map.left;
    var Ty = F_flip_map.top - L_flip_map.top;
    var Sx = F_flip_map.width / L_flip_map.width;
    var Sy = F_flip_map.height / L_flip_map.height;
    el.style.transformOrigin = "0 0";
    el.style.transition = "";
    var trans = "translate(" + Tx + "px, " + Ty + "px) scale(" + Sx + ", " + Sy + ")";
    el.style.transform = trans;
    state.resetIn(rects, L_flip_map);
    requestAnimationFrame(function () {
        el.style.transition = "all .4s cubic-bezier(.54,-0.29,.17,1.11)";
        el.style.transform = "none";
    });
};
var Z_path = "FLIP_zoom";
var zoom_paths = function (uid) { return ({
    rects: [Z_path, "rects", uid],
    elems: [Z_path, "elems", uid],
    clicks: [Z_path, "clicks", uid]
}); };
/**
 *
 * `FLIPFirst`
 *
 * ```
 * order: normalizeTree -> render -> diff -> init -> release
 *                        | hdom |         | dom | unmounted
 * ```
 *
 * 1. el mounted (init): look for existing flip map for id
 *  - if exists, Play anim and store new flip map rect (for
 *    navs)
 *  - if doesn't, nada
 * 2. el clicked (render.attrs.onclick): measure and store
 *    flip map for id
 * 3. el released: if clicked, calc flip rect and lookup for
 *    id:
 *  - if first === last, no change (on nav e.g.)
 *  - if first !== last, nav change (store rect for id)
 *
 */
var FLIPFirst = function (_a) {
    // 📌 TODO: GOOD PLACE FOR AN `onStart` hook animation/callback
    var state = _a.state, id = _a.id, target = _a.target;
    var _b = zoom_paths(id), rects = _b.rects, clicks = _b.clicks;
    // sets the rect in state for next el init to sniff
    var flip_map = getRect(target);
    state.resetIn(rects, flip_map);
    // registers component as having been clicked (focused)
    state.resetIn(clicks, true);
};
/**
 * https://coder-coder.com/z-index-isnt-working/
 */
var zIndex = function (el, idx) { return (el.style.zIndex = idx); };
/**
 * 1. if it has been clicked that means the last thing
 *    that happened was a click that triggered this init
 *    so we do the calcs
 *
 * 2. if a back/nav (no frame) event was what triggered
 *    the init do the calcs with no frame
 *
 * What's happening:
 * - on first click (render)
 * - rect registered
 * - frame registered
 * - navs
 * - on init of new DOM
 * - checks for rect & frame
 * - uses rect & frame to calc diff
 * - PLAY
 *
 */
var FLIPLastInvertPlay = function (_a) {
    var element = _a.element, state = _a.state, id = _a.id, 
    // just baffle them with https://cubic-bezier.com/
    // transition = "all .3s cubic-bezier(.54,-0.29,.17,1.11)"
    _b = _a.transition, 
    // just baffle them with https://cubic-bezier.com/
    // transition = "all .3s cubic-bezier(.54,-0.29,.17,1.11)"
    transition = _b === void 0 ? "all .3s ease-in-out" : _b;
    element.setAttribute("flip", id);
    var _c = zoom_paths(id), rects = _c.rects, clicks = _c.clicks;
    var F_flip_map = paths_1.getIn(state.deref(), rects) || null;
    // NO RECT => NOT CLICKED
    if (!F_flip_map)
        return;
    /**
     * 🔥 this may cause issues for parrallel anims append this
     * to a specific target using:
     * Array.from(el.querySelectorAll("[flip]")).forEach(x=>
     * if i last... el.scrollIntoView())
     *
     */
    // 🕞 calculate location and size
    var L_flip_map = getRect(element);
    // recalc rect if out of initial view after scrolling into view
    if (Math.abs(F_flip_map.top - L_flip_map.top) > window.innerHeight) {
        element.scrollIntoView();
        L_flip_map = getRect(element);
    }
    var Tx = F_flip_map.left - L_flip_map.left;
    var Ty = F_flip_map.top - L_flip_map.top;
    var Sx = F_flip_map.width / L_flip_map.width;
    var Sy = F_flip_map.height / L_flip_map.height;
    // console.log({ Tx, Ty, Sx, Sy })
    element.style.transformOrigin = "top left";
    element.style.transition = "";
    var trans = "translate(" + Tx + "px, " + Ty + "px) scale(" + Sx + ", " + Sy + ")";
    element.style.transform = trans;
    // PLAY
    requestAnimationFrame(function () {
        // 🕤 just before animating, scroll to new location
        // element.style.transformOrigin = "top left"
        element.style.transition = transition;
        element.style.transform = "none";
        // 💩 hack for removing zIndex after animation is complete
        // 📌 TODO:    🔻 GOOD PLACE FOR AN `onComplete` hook animation/callback
        setTimeout(function () { return zIndex(element, 0); }, 200);
    });
    // move element to front
    zIndex(element, 1);
    // 🔍 consider exposing in the API
    var clicked = paths_1.getIn(state.deref(), clicks) || null;
    if (!clicked) {
        // console.log(uid, "FLIP'ed on navigated")
        state.resetIn(rects, null);
    }
    else {
        // console.log(uid, "FLIP'ed on click! 👆")
        state.resetIn(rects, L_flip_map);
    }
    // remove click frame
    state.resetIn(clicks, null);
};
var state = new atom_1.Atom({});
// render: onclick
exports.FLIP_FIRST = register_1.registerCMD((_a = {},
    _a[keys_1.CMD_SUB$] = "_FLIP_FIRST",
    _a[keys_1.CMD_ARGS] = function (x) { return x; },
    _a[keys_1.CMD_WORK] = function (_a) {
        var id = _a.id, target = _a.target;
        return FLIPFirst({ id: id, target: target, state: state });
    },
    _a));
// init
exports.FLIP_LAST_INVERSE_PLAY = register_1.registerCMD((_b = {},
    _b[keys_1.CMD_SUB$] = "_FLIP_LAST_INVERSE_PLAY",
    _b[keys_1.CMD_ARGS] = function (x) { return x; },
    _b[keys_1.CMD_WORK] = function (_a) {
        var id = _a.id, element = _a.element;
        return FLIPLastInvertPlay({ id: id, element: element, state: state });
    },
    _b));
