export {
  boot,
  // , registerRouter
  registerRouterDOM
} from "./registers"

export { multiplex } from "./multiplex"

export {
  DOMnavigated$,
  DOMContentLoaded$,
  command$,
  out$,
  popstate$,
  run$
} from "./stream$"
