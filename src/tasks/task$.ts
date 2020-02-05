import { run$, multiplex } from "../core"

export const task$ = run$.subscribeTopic(
  false,
  {
    next: multiplex,
    error: console.warn
  },
  { id: "task$_stream" }
)
