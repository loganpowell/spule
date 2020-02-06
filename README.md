## Outline

- Intro:
  - Data-oriented javascript framework built from [@thi.ng/umbrella](http://thi.ng/umbrella) libraries
  - Other frameworks: 
    - too much boilerplate
    - too much context switching when adding functionality (directory duck duck goose)
    - large API surface areas
    - Poor ["reasonaboutability"]()
  - This is simpler:
    - upstream (producers) && downstream (consumers)
    - async is built in (no middleware required)
    - Elm/Flux inspired uni-directional data flow
      - via [FRP]() under the hood 
      - direct stream participation opt-in only- i.e., not necessary for common needs
    - Complex asynchronous action coreography is handled for the user by the framework
    - Learning curve is basically five function signatures (within Tasks, more later)
+ IMAGE(s) of a socket and a light switch. You plug in a light and turn it on with a switch...
- ♻ Framework Architecture

### Command Keys
| Key       | Value    | Role(s)                                | Required  |
| --------- | -------- | -------------------------------------- | --------- |
| `sub$`    | String   | Topic ID: connects Command to handler  | [DP]/[RG] |
| `args`    | Any      | Payload or payload function            | [AH]      |
| `path`    | Any      | Lens for global state evolution        | [ST]      |
| `handler` | Function | Dispatches on Command (side effects)   | [RG]      |
| `source$` | Stream   | Upstream Command "Feeder"              | [AH]      |
| `reso`    | Function | Promise resolution handler             | [PR]      |
| `erro`    | Function | Promise rejection handler              | [PR]      |



parse_URL constants

| URL component key | description |
| --- | --- |        
| DOM           | DOM node target                                           |
| URL           | full URL/route                                            |
| URL_path      | route path as array                                       |
| URL_domain    | top-level domain as array                                 |
| URL_subdomain | subdomain as array                                        |
| URL_query     | node querystring parsed URL parameters                    |
| URL_hash      | hash string to/from URL if any                            |
| URL_data      | data returned by router                                   |
| URL_page      | page component to render URL_data with                    |

| router config key | description |
| --- | --- |        
| HEAD          | metadata wrapper for router (targets DOM <head>)          |
| BODY          | data wrapper for router                                   |
| prep          | pre-router behavior Task/Command injection                |
| post          | post=router behavior Task/Command injection               |
| prefix        | URL path string for the router to ignore                  |
| router        | @thi.ng/EquivMap pattern matching function                |

| Command key | description |
| --- | --- |        
| sub$          | Command primary/unique key (topic subscription)           |
| args          | multiple signature intra-Task Command state see [Spule]() |
| reso          | intra-Command resolver of Promise args                    |
| erro          | intra-Command handler for Promise args rejetions          |
| handler       | where Commands' actual "work" is done (side-fx/mutations) |
| source$       | upstream (source stream) Command connector                |

| boot config key | description |
| --- | --- |        
| run           | primary userland dispatch function                        |
| state         | global immutable state container                          |
| root          | DOM mount node for application                            |
| app           | root application view                                     |
| trace         | enable logging of every global state update               |
| draft         | state shape scaffolding                                   |



##### RG: Command _Registration_
##### DP: Command _Dispatch_
##### PR: Commands Containing _Promises_ (during dispatch)
##### AH: _Ad-hoc_ Configuration of Command Dispatch   
##### ST: Global _State_ evolution (lens)

[lensed]()

### Symbols Glossary
| Symbol               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `(#) =>`             | [function with `#` (number) parameters]        |
| `PRI`                | Primitive value (boolean, string, number)      |
| `{?}`                | Object                                         |
| `{P}`                | Promise                                        |
| `{C}`                | [Command object]                               |
| `{A}`                | [Accumulator object]                           |
| `[{C},{C}]` / `[T]`  | [Task array]                                   |
| `(A) => [T]`         | [Subtask]                                      |

[function with `#` (number) parameters](#intra-task-accumulator)
[Command object](#commands)                              
[Accumulator object](#intra-task-accumulator)                          
[Task array](#tasks)                                  
[Subtask](#subtasks)                            

- Commands
- Tasks
- Subtasks
- Intra-Task Accumulator

  - Cross-platform router
  - ❤ Data "adornment" (Google Doc -> revise it) TABLE
    1. First order UI => URL
    2. Second order UI => Data
    3. Third order UI => Streams of events & data
    4. Fourth order UI => Componentization ([@thi.ng/hdom](https://github.com/thi-ng/umbrella/blob/a02d7b1dbea4e4a294d238af108d23ec831c1981/packages/transducers/src/func/deep-transform.ts) `spec`)
    5. Fith order UI => component styling (styled-system-hdom)
- streams (FRP Architecture)
  - marble diagram
  - built-ins (exposed):
    - `run$`
    - `out$`
  - built-ins (under the hood):
    - `task$`
    - `command$`
  - ad-hoc stream attachments
    - SEE ADVANCED SECTION BELOW...
- Commands (synchronous payloads)
  - primary keys: (TABLE)
    - `sub$`: a Topic key for for registering the event 
    - `args`: arguments for the handler of the event  
    - `path`: path/lens for targeted state evolution
  - built-ins 
    - State Evolution: `sub$: "STATE"`
      - this is where the `path` key comes into play
    - Routing: `sub$: "ROUTE"` (see "Routing" section below)
    - [FLIP]() Animations: `sub$: "FLIP"`
  - Command Registration
    - during registration of a Command, you will only need the primary keys
      - `sub$`: Topic key for for registering the event
      - `args`: payload (static only) of the event
- Tasks (ordered Command dispatch 💃 asynchronous payloads!)
  - A Task is just an array of Commands, but with some special features:
    - pass data between Commands within a task
    - use Promises (async) in a Command
    - (de)compose a Task into/from Subtasks
  - w/in a Task, dispatcher recognizes two additional keys for dealing with Promises:
    - `reso`: used for handling resolved Promise args
    - `erro`: used for handling rejected Promise args
  - dispatcher
    - composition of Commands
    - "Command `args` threading"
    - `args` signature dynamic dispatch:
      - Functions
      - Objects
      - Strings|Booleans
  - forms:
    - formulaic tasks (no outside input)
    - subtasks (outside input)
      - compose into higher-order tasks or 
- subtasks
- Routing
  - combine browser API instigated ("popstate", "DOMContentLoaded") with user-invoked stream emissions
  - registered the `sub$: "ROUTE"` Command 
  - `route_cfg` Object (TABLE)
    - a [@thi.ng/associative](http://thi.ng/associative) `EquivMap` pattern matcher
    - see [LINK TO DOCS IN CODE CONTEXT 📌 TODO]
- Naming Conventions:
  - constants: `CAPITAL_SNAKE_CASE`
    - generally accepted convention for constants in JS
    - used for defining Commands (as though they might cause
      side effects, their subscription names are constant -
      i.e., a signal for emphasising this aspect of a
      Command)
  - pure functions: `snake_case`
    - some novelty here due to pure functions acting like
      constants in that with the same input they always
      return the same output
  - impure functions: `camelCase`
    - regular side-effecty JS
  - Tasks: `DOUBLE__UNDERSCORE__SNAKE__CASE`
    - implies the inputs and outputs on either end of a Task
    - Tasks also should be treated as pure functions where
      the output is really just data (and lambdas). This is
      going in the direction of "code as data"
- lots'o'examples


## Commands

```js
const genie = {
  sub$: "GENIE",
  args: "your wish"
  work: x => console.log("🧞:", x, "is my command")
}

const GENIE = registerCMD(genie)

run(GENIE)
// 🧞: your wish is my command
```

A Command object can have four keys:
 1. `sub$` (required)
 2. `args` (optional, sets default) during registration
 3. `work` (required)
 4. `src$` (optional, enables stream to feed Command)

## Core

Handles Collections (array) of Commands ("Tasks") which
require _ordered_ choreography and/or have a dependency
on some (a)sync data produced by a user interaction.

### Synopsis:
- Async `reduce` function, that passes an accumulator
  (`acc`) as a local state container between Command
  invocations.
- Commands are composed in-situ in userland (Ad hoc)
- spools a collection of Commands as a Task
- resolves any promises contained within a Command
- passes an accumulator (acc) to subsequent Commands in a
  Task

### Type checks on function signatures

There are two valid forms for Task entries:
1. a Unary function returning an array of Commands:
   referred to as "Subtasks"
2. A Command object: dispatch to registered handlers

## Recognized Keys

There are 4 recognized keys for a Command object:

### Primary keys

##### `sub$` key

- Topic identifier: used for registering handlers hooked
   onto the Command stream.

##### `args` key

- __primary control structure__ with three recognized
  forms that do different things in the context of a
  Task:
- non-function `args` (primitives, objects) send the args
  as-is to the Command handler
- nullary fns (`(0)=>` ) send the args_ as a Command to
  a `sub$` _stream_ of your choosing (ADVANCED: see
  Ad-hoc Stream Injection below)
- unary fns (`(1)=>`) are passed the inter-Task
  accumulated value, called and the resulting value is
  passed to registered Command handler
- Promises (and those returned from `(1)=>`) are resolved
  and their values sent to the handler
- new vals (Objects) are merged with accumulated object
  from preceding Task results(dupe keys overwritten)

### Promise-specific keys -> binary (as in two parameter,
  not boolean) functions:

##### `reso` key

- (resolving) function `(2)=>` = handle resolved promises:
  MUST be a binary fn `(acc, resolved Promise)
  =>`

##### `erro` key

- `(2)=>` = handle rejected promises: MUST be
  a binary fn `(acc, Promise rejection) =>`

### Subtasks:

Subtasks are the way you compose tasks. Insert a Task and
the spool will unpack it in place (super -> sub
order preserved) A Subtask must be defined as a unary
function that accepts an accumulator object and returns a
Task, e.g.:

#### PSEUDO

```js
// { C: Command }
// ( { A: Accumulator }: Object ) => [{C},{C}]: Subtask
let someSubtask = ({A}) => [{C}, {C}, ({A})=>[{C},{C}], ...]
```

#### Example

```js
// subtask example:
let subtask1 = acc => [
 { sub$: "acc"
 , args: { data: acc.data } },
 { sub$: "route"
 , args: { route: { href: acc.href } } }
]
// task
let task = [
 { args: { href: "https://my.io/todos" } }, // acc init
 { sub$: "fetch"
 , args: ({ href }) => fetch(href).then(r => r.json())
 , erro: (acc, err) => ({ sub$: "cancel", args: err })
 , reso: (acc, res) => ({ data: res }) },
 acc => subtask1(acc), // subtask reference
 { sub$: "FLIP" , args: "done" }
]
```
### Ad-hoc stream injection
- ADVANCED
  - ad-hoc stream injection
    - nullary (thunk) in a Task
  - `rendertron`
ADVANCED USE ONLY 👽

HURL tries to hide the stream implentation from the user
as much as possible, but allows you to go further down
the rabbit hole if so desired. You may send Commands to a
separate stream of your own creation during a Task by
using a nullary ("thunk") `(0)=>` function signature as
the `args` value of a Command. If this is the case, the
spool assumes the `sub$` key references a stream and
sends the return value of the thunk to that stream
This feature can come in handy for "fire and forget"
events (e.g., logging, analytics, etc.)

> Note: if you need to pass the accumulator to your
thunk, put it in a subtask, where you can
access/destructure the data from the acc passed into the
subtask function

```js
import { stream } from "@thi.ng/rstream"
import { map, comp } from "@thi.ng/transducers"
// ad-hoc stream
let login = stream().subscribe(comp(
 map(x => console.log("login ->", x)),
 map(({ token }) => loginToMyAuth(token))
))
// subtask
let subtask_login = ({ token }) => [
 { sub$: login // <- stream
 , args: () => ({ token }) } // <- use acc
]
// task
let task = [
 // no sub$, just pass data
 { args: { href: "https://my.io/auth" } },
 { sub$: login , args: () => "logging in..." },
 { sub$: "AUTH"
 , args: ({ href }) => fetch(href).then(r => r.json())
 , erro: (acc, err) => ({ sub$: "cancel", args: err })
 , reso: (acc, res) => ({ token: res }) },
 acc => subtask_login(acc),
 { sub$: login , args: () => "log in success" }
]
```

## Stream Architecture:

`run$` is the primary event stream exposed to the user
via the `ctx` object injected into every `hdom` component
the command stream is the only way the user changes
anything in `hurl`

### Marble Diagram

```
0>- |------c-----------c--[~a~b~a~]-a----c-> : calls
1>- |ps|---1-----------1----------0-1----1-> : run$
2>- |t0|---------a~~b~~~~~~~~~~~a~*--------> : task$
3>- |t1|---c-----------c------------a----c-> : command$
4>- ---|ps|c-----a--b--c--------a---a----c-> : out$
Handlers
a>- ---|ta|------*--------------*---*------> : registerCMD
b>- ---|tb|---------*----------------------> : registerCMD
c>- ---|tc|*-----------*-----------------*-> : registerCMD
```

### Streams

- `0>-`: `ctx.run$.next(x)` userland dispatches
- `1>-`: `pubsub({ topic: x => x.length === 0 })` `run$`
  stream
- `2>-`: pubsub = `false` ? -> `task$` stream
- `3>-`: pubsub = `true` ? ->`command$` stream
- `4>-`: `pubsub({ topic: x => x.sub$ })`: `out$` stream ->
  `register_command`

### Handlers

`4>-` this is the stream to which the user (and
framework) attaches handlers. Handlers receive events
they subscribe to as topics based on a `sub$` key in a
Command object.

#### Handlers (framework provided):

- "state": Global state mutations
- "route": Routing
- "FLIP" :
  [F.L.I.P.](https://aerotwist.com/blog/flip-your-animations/)
  animations 
  
### `run$`

User-land event dispatch stream

This stream is directly exposed to users via `ctx` Any
one-off Commands `next`ed into this stream are sent to
the `command$` stream. Arrays of Commands (Tasks) are
sent to the `task$` stream.
