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
- ADVANCED
  - ad-hoc stream injection
    - nullary (thunk) in a Task
  - `rendertron`

  