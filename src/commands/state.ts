/**
 * @module SET_STATE
 * @format
 */

import { sub$_, args_, handler_, STATE_, PATH_ } from "../keys.js"
import { set$$tate } from "../store"

import { registerCMD } from "./register.js"

export const createSetStateCMD = store => registerCMD({
  [sub$_]: "SET_STATE",
  [args_]: x => x,
  [handler_]: args => set$$tate(args[PATH_], args[STATE_], store)
})
