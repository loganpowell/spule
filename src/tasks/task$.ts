import { run$ } from "../core/stream$.js"
import { multiplex } from "../core/multiplex.js"

export const task$ = run$.subscribeTopic(
  false,
  {
    next: multiplex,
    error: console.warn
  },
  { id: "task$_stream" }
)
