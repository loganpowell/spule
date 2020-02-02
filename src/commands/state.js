/** @format */

import { registerCMD } from "../register"
import { set$$tate, sub$_, args_, handler_, STATE_, PATH_ } from "../store"

export const SET_STATE = registerCMD({
  [sub$_]: "SET_STATE",
  [args_]: x => x,
  [handler_]: args => set$$tate(args[PATH_], args[STATE_])
})
