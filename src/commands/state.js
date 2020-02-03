/**
 * @module SET_STATE
 * @format
 */

import { sub$_, args_, handler_ } from "../constants.js"
import { set$$tate } from "../store"

import { registerCMD } from "./register.js"

export const SET_STATE = registerCMD({
  [sub$_]: "SET_STATE",
  [args_]: x => x,
  [handler_]: ({ STATE, PATH }) => set$$tate(PATH, STATE)
})
