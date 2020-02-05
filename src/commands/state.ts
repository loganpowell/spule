/**
 * @module SET_STATE
 * @format
 */

import { CMD_SUB$, CMD_ARGS, CMD_WORK, STATE_DATA, STATE_PATH } from "../keys.js"
import { set$$tate } from "../store"

import { registerCMD } from "./register.js"

export const createSetStateCMD = store => registerCMD({
  [CMD_SUB$]: "_SET_STATE",
  [CMD_ARGS]: x => x,
  [CMD_WORK]: args => set$$tate(args[STATE_PATH], args[STATE_DATA], store)
})
