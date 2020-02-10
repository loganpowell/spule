/**
 * @module commands/state
 */
import { CMD_SUB$, CMD_ARGS, CMD_WORK, STATE_DATA, STATE_PATH } from "../keys"
import { set$$tate } from "../store"

import { registerCMD } from "./register"

/**
 *
 * Higher-order function that takes a `@thi.ng/Atom` state
 * container and returns a Command object for setting that
 * Atom's state by the provided path
 */
export const createSetStateCMD = store =>
  registerCMD({
    [CMD_SUB$]: "_SET_STATE",
    [CMD_ARGS]: x => x,
    [CMD_WORK]: args => set$$tate(args[STATE_PATH], args[STATE_DATA], store)
  })
