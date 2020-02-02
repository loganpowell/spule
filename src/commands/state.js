/** @format */

import { registerCMD } from "../register"
import { set$$tate, sub$, args, handler, STATE, PATH } from "../store"

export const SET_STATE = registerCMD({
  [sub$]: "SET_STATE",
  [args]: x => x,
  [handler]: args => set$$tate(args[PATH], args[STATE])
})
