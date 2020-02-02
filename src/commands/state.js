import { registerCMD } from "../register"
import { set$State, sub$, args, handler, STATE, PATH } from "../store"

export const SET_STATE = registerCMD({
  [sub$]: "SET_STATE",
  [args]: x => x,
  [handler]: args => set$State(args[PATH], args[STATE])
})
