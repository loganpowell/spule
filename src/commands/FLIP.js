/**
 * @module Commands: FLIP
 * @format
 */

import { Atom } from "@thi.ng/atom"
import { getIn } from "@thi.ng/paths"
import { registerCMD } from "../register/primaries"
import { sub$_, args_, handler_ } from "../store"

//
//    d8                  888
//  _d88__  e88~-_   e88~\888  e88~-_
//   888   d888   i d888  888 d888   i
//   888   8888   | 8888  888 8888   |
//   888   Y888   ' Y888  888 Y888   '
//   "88_/  "88_-~   "88_/888  "88_-~
//
//
// add before/after transition hooks for support animations

function getRect(element, frame) {
  const {
    top,
    bottom,
    left,
    right,
    width,
    height
  } = element.getBoundingClientRect()

  const parent = frame ? frame.getBoundingClientRect() : null

  return {
    top: top - (parent ? parent.top : 0),
    bottom,
    left: left - (parent ? parent.left : 0),
    right,
    width,
    height
  }
}

const shuffle_paths = uid => ({
  rects: ["_FLIP_shuffle", "rects", uid],
  elems: ["_FLIP_shuffle", "elems", uid]
})

const FLIP_all = (el, state, uid, frameDOMel = null) => {
  const { rects } = shuffle_paths(uid)

  if (!getIn(state.deref(), rects))
    return state.resetIn(rects, getRect(el, frameDOMel))

  const F_flip_map = getIn(state.deref(), rects)
  const L_flip_map = getRect(el, frameDOMel)
  // console.log({ F_flip_map, L_flip_map })

  const Tx = F_flip_map.left - L_flip_map.left
  const Ty = F_flip_map.top - L_flip_map.top
  const Sx = F_flip_map.width / L_flip_map.width
  const Sy = F_flip_map.height / L_flip_map.height

  el.style.transformOrigin = "0 0"
  el.style.transition = ""

  const trans = `translate(${Tx}px, ${Ty}px) scale(${Sx}, ${Sy})`

  el.style.transform = trans

  state.resetIn(rects, L_flip_map)

  requestAnimationFrame(() => {
    el.style.transition = "all .4s cubic-bezier(.54,-0.29,.17,1.11)"
    el.style.transform = "none"
  })
}

const zoom_paths = uid => ({
  rects: ["_FLIP_zoom", "rects", uid],
  elems: ["_FLIP_zoom", "elems", uid],
  clicks: ["_FLIP_zoom", "clicks", uid],
  scrolls: ["_FLIP_zoom", "scroll", uid]
})

/**
 *
 * order:
 * normalizeTree -> render -> diff -> init -> release
 *                 | hdom |         | dom  | post-dom
 *
 * have to think backwards:
 * 1. el mounted (init): look for existing flip map for id
 *  - if exists, Play anim and store new flip map rect (for navs)
 *  - if doesn't, nada
 * 2. el clicked (render.attrs.onclick): measure and store flip map for id
 * 3. el released: if clicked, calc flip rect and lookup for id:
 *  - if first === last, no change (on nav e.g.)
 *  - if first !== last, nav change (store rect for id)
 * @example
 * FLIPFirst({ state: "bloop"})
 *
 */
const FLIPFirst = ({ state, id, target }) => {
  // 📌 TODO: GOOD PLACE FOR AN `onStart` hook animation/callback

  const { rects, clicks, scrolls } = zoom_paths(id)

  // sets the rect in state for next el init to sniff
  const flip_map = getRect(target)
  state.resetIn(rects, flip_map)

  // registers component as having been clicked (focused)
  state.resetIn(clicks, true)
  state.resetIn(scrolls, { y: window.scrollY, x: window.scrollX })
}

/**
 * https://coder-coder.com/z-index-isnt-working/
 */
const zIndex = (el, idx) => (el.style.zIndex = idx)

/**
 * 1. if it has been clicked that means the last thing
 *    that happened was a click that triggered this init
 *    so we do the calcs
 *
 * 2. if a back/nav (no frame) event was what triggered
 *    the init do the calcs with no frame
 */
const FLIPLastInvertPlay = ({
  element,
  state,
  id,
  // just baffle them with https://cubic-bezier.com/
  transition = "all .3s cubic-bezier(.54,-0.29,.17,1.11)"
}) => {
  element.setAttribute("flip", id)
  const { rects, clicks, scrolls } = zoom_paths(id)

  const F_flip_map = getIn(state.deref(), rects) || null
  // NO RECT => NOT CLICKED
  if (!F_flip_map) return

  // 🕛 if flip active, scroll element on init
  // element.scrollIntoView()
  /**
   * 🔥 this may cause issues for parrallel anims append this
   * to a specific target using:
   * Array.from(el.querySelectorAll("[flip]")).forEach(x=>
   * if i last... el.scrollIntoView())
   *
   */
  // 🕞 calculate location and size
  let L_flip_map = getRect(element)

  // recalc rect if out of initial view after scrolling into view
  if (Math.abs(F_flip_map.top - L_flip_map.top) > window.innerHeight) {
    element.scrollIntoView()
    L_flip_map = getRect(element)
  }

  const Tx = F_flip_map.left - L_flip_map.left
  const Ty = F_flip_map.top - L_flip_map.top
  const Sx = F_flip_map.width / L_flip_map.width
  const Sy = F_flip_map.height / L_flip_map.height

  // 🕕 just before "Last", scroll element to middle of page
  // const top = L_flip_map.top + window.pageYOffset
  const { x, y } = getIn(state.deref(), scrolls) // top - window.innerHeight / 2

  window.scrollTo(x, y)

  // console.log({ Tx, Ty, Sx, Sy })

  element.style.transformOrigin = "top left"
  element.style.transition = ""
  const trans = `translate(${Tx}px, ${Ty}px) scale(${Sx}, ${Sy})`
  element.style.transform = trans

  // PLAY
  requestAnimationFrame(() => {
    // 🕤 just before animating, scroll to new location
    window.scrollTo(x, y)

    // element.style.transformOrigin = "top left"

    element.style.transition = transition
    element.style.transform = "none"
    // 💩 hack for removing zIndex after animation is complete
    // 📌 TODO:    🔻 GOOD PLACE FOR AN `onComplete` hook animation/callback
    setTimeout(() => zIndex(element, 0), 200)
  })
  // move element to front
  zIndex(element, 1)
  // 🔍 consider exposing in the API

  const clicked = getIn(state.deref(), clicks) || null

  if (!clicked) {
    // console.log(uid, "FLIP'ed on navigated")
    state.resetIn(rects, null)
  } else {
    // console.log(uid, "FLIP'ed on click! 👆")
    state.resetIn(rects, L_flip_map)
  }

  // remove click frame
  state.resetIn(clicks, null)
}

/**
 * What's happening:
 * - on first click (render)
 *  - rect registered
 *  - frame registered
 * - navs
 * - on init of new DOM
 *  - checks for rect & frame
 *  - uses rect & frame to calc diff
 *  - PLAY
 */

const state = new Atom({})

export const FLIP_FIRST = registerCMD({
  [sub$_]: "FLIP_FIRST",
  [args_]: x => x,
  [handler_]: ({ id, target }) => FLIPFirst({ id, target, state })
})

export const FLIP_LAST_INVERSE_PLAY = registerCMD({
  [sub$_]: "FLIP_LAST_INVERSE_PLAY",
  [args_]: x => x,
  [handler_]: ({ id, element }) => FLIPLastInvertPlay({ id, element, state })
})
