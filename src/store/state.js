/**
 * @module set$$tate
 * @format
 */

import { Atom } from "@thi.ng/atom"
import { isPlainObject } from "@thi.ng/checks"

import { DEFAULT_CFG } from "../_api"

// Global $store$ Container from [@thi.ng/atom](http://thi.ng/atom)
export const $store$ = new Atom(DEFAULT_CFG)

/**
 *
 * ## `set$$tate`
 *
 * Swaps the current value at the given path/lens into the
 * global store with that of the given value. Checks to see
 * if that value should be either spread into an existing
 * object or a complete replacement
 *
 */
export const set$$tate = (path, val) =>
  $store$.swapIn(path, x =>
    !path.length && !isPlainObject(val)
      ? { ...x, [Object.keys(val)[0]]: val }
      : isPlainObject(x) && isPlainObject(val)
      ? { ...x, ...val }
      : val
  )
// $store$.resetIn(path, val)
