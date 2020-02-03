/**
 * @module SET_STATE
 * @format
 */

import { registerCMD } from "../core"
import { set$$tate, sub$_, args_, handler_ } from "../store"

export const SET_STATE = registerCMD({
  [sub$_]: "SET_STATE",
  [args_]: x => x,
  [handler_]: ({ STATE, PATH }) => set$$tate(PATH, STATE)
})
