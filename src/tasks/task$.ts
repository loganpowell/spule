/**
 * @module tasks/task$
 */
// explicit imports = prevent circular deps
import { run$ } from "../core/stream$"
import { multiplex } from "../core/multiplex"

/**
 *
 * Task stream that handles Arrays of Commands. Dispatches
 * to `multiplex`er (the heart of `spule`)
 *
 */
export const task$ = run$.subscribeTopic(
  false,
  {
    next: multiplex,
    error: console.warn
  },
  { id: "task$_stream" }
)
