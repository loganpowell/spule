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

  <!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   -   [registerCMD][1]
        -   [all][2]
            -   [Examples][3]
    -   [registerCMD][4]
        -   [all][5]
            -   [Examples][6]
    -   [registerCMD][7]
        -   [all][8]
            -   [Examples][9]
    -   [registerCMD][10]
        -   [all][11]
            -   [Examples][12]
    -   [HURLer][13]
        -   [Parameters][14]
    -   [\_\_SET_LINK_ATTRS_DOM][15]
    -   [\_SET_LINK_ATTRS_DOM][16]
        -   [Payload: function][17]
        -   [Handler: side-effecting][18]
    -   [\_\_HREF_PUSHSTATE_DOM][19]
    -   [\_HREF_PUSHSTATE_DOM][20]
        -   [Payload: function][21]
        -   [Handler: side-effecting][22]
    -   [\_\_NOTIFY_PRERENDER_DOM][23]
    -   [\_NOTIFY_PRERENDER_DOM][24]
        -   [Payload: static][25]
        -   [Handler: side-effecting][26]
    -   [og:title][27]
    -   [FLIPFirst][28]
        -   [Parameters][29]
    -   [zIndex][30]
        -   [Parameters][31]
    -   [FLIPLastInvertPlay][32]
        -   [Parameters][33]
    -   [L_flip_map][34]
    -   [state][35]
    -   [fURL][36]
-   [HREF/URL Parser][37]
    -   [Examples:][38]
        -   [Parameters][39]
    -   [unfURL][40]
        -   [Parameters][41]
    -   [stringify_type][42]
        -   [stringify_type][43]
        -   [Parameters][44]
    -   [trace$][45]
    -   [trace_stream][46]
        -   [Parameters][47]
    -   [stringify_w_functions][48]
        -   [Parameters][49]
    -   [x_key_ERR][50]
        -   [Parameters][51]
    -   [diff_keys][52]
        -   [Parameters][53]
    -   [registered][54]
    -   [registerCMD][55]
        -   [Destructuring Behavior][56]
        -   [Example][57]
        -   [Parameters][58]
    -   [Error][59]
    -   [registerRouterDOM][60]
        -   [Parameters][61]
    -   [boot][62]
        -   [Parameters][63]
    -   [isObject][64]
    -   [\_\_URL\_\_ROUTE][65]
        -   [Parameters][66]
    -   [erro\_][67]
    -   [\_SET_ROUTER_LOADING_STATEcod][68]
        -   [Payload: static][69]
        -   [Handler: side-effecting][70]
    -   [args\_][71]
    -   [\_SET_ROUTER_PATH][72]
        -   [Payload: function][73]
        -   [Handler: side-effecting][74]
    -   [args\_][75]
        -   [Handler: side-effecting][76]
    -   [\_\_URL_DOM\_\_ROUTE][77]
        -   [Parameters][78]
    -   [Streams][79]
    -   [run$][80]
-   [Stream Architecture:][81]
    -   [Marble Diagram][82]
    -   [Streams][83]
    -   [Handlers][84]
        -   [Handlers (framework provided):][85]
    -   [run$][86]
    -   [out$][87]
    -   [out$][88]
    -   [command$][89]
    -   [command$][90]
    -   [task$][91]
    -   [task$][92]
    -   [DOMnavigated$][93]
    -   [getting the hurl property from the various events:][94]
    -   [spule][95]
    -   [spule][96]
    -   [spool][97]
        -   [TL;DR:][98]
        -   [Synopsis:][99]
        -   [Type checks on function signatures][100]
    -   [Recognized Keys][101]
        -   [Primary keys][102]
            -   -   [sub$ key][103]
                -   [args key][104]
        -   [Promise-specific keys -> binary (as in two parameter,][105]
            -   -   [reso key][106]
                -   [erro key][107]
        -   [Subtasks:][108]
            -   [PSEUDO][109]
            -   [Example][110]
            -   [Use:][111]
        -   [Ad-hoc stream injection][112]
        -   [Parameters][113]
    -   [HURL][114]
    -   [err_str][115]
        -   [Parameters][116]
    -   [constants][117]
    -   [DEFAULT_CFG][118]
    -   [Atom][119]
    -   [set$$tate][120]
    -   [set$$tate][121]
        -   [Parameters][122]

## registerCMD

### all

enables inspection of the existing Command registrations
if using Chrome, there's an additional advantage of being
able to find the `[[FunctionLocation]]` of the Command,

#### Examples

```javascript
registerCMD.all.entries()
// => ⬇ [[Entries]]
//      ⬇ 0: {"HURL_CMD" => Object}
//          key: "HURL_CMD"
//        ⬇ value:
//            sub$: "HURL_CMD"
//          ⬇ args: ev => ev
//              arguments: (...)
//              caller: (...)
//              length: 1
//              name: "args"
//            ➡ __proto__: ƒ ()
//              [[FunctionLocation]]: routing.js:32 (♻ Chrome)
//            ➡ [[Scopes]]: Scopes[2]
```

## registerCMD

### all

enables inspection of the existing Command registrations
if using Chrome, there's an additional advantage of being
able to find the `[[FunctionLocation]]` of the Command,

#### Examples

```javascript
registerCMD.all.entries()
// => ⬇ [[Entries]]
//      ⬇ 0: {"HURL_CMD" => Object}
//          key: "HURL_CMD"
//        ⬇ value:
//            sub$: "HURL_CMD"
//          ⬇ args: ev => ev
//              arguments: (...)
//              caller: (...)
//              length: 1
//              name: "args"
//            ➡ __proto__: ƒ ()
//              [[FunctionLocation]]: routing.js:32 (♻ Chrome)
//            ➡ [[Scopes]]: Scopes[2]
```

## registerCMD

### all

enables inspection of the existing Command registrations
if using Chrome, there's an additional advantage of being
able to find the `[[FunctionLocation]]` of the Command,

#### Examples

```javascript
registerCMD.all.entries()
// => ⬇ [[Entries]]
//      ⬇ 0: {"HURL_CMD" => Object}
//          key: "HURL_CMD"
//        ⬇ value:
//            sub$: "HURL_CMD"
//          ⬇ args: ev => ev
//              arguments: (...)
//              caller: (...)
//              length: 1
//              name: "args"
//            ➡ __proto__: ƒ ()
//              [[FunctionLocation]]: routing.js:32 (♻ Chrome)
//            ➡ [[Scopes]]: Scopes[2]
```

## registerCMD

### all

enables inspection of the existing Command registrations
if using Chrome, there's an additional advantage of being
able to find the `[[FunctionLocation]]` of the Command,

#### Examples

```javascript
registerCMD.all.entries()
// => ⬇ [[Entries]]
//      ⬇ 0: {"HURL_CMD" => Object}
//          key: "HURL_CMD"
//        ⬇ value:
//            sub$: "HURL_CMD"
//          ⬇ args: ev => ev
//              arguments: (...)
//              caller: (...)
//              length: 1
//              name: "args"
//            ➡ __proto__: ƒ ()
//              [[FunctionLocation]]: routing.js:32 (♻ Chrome)
//            ➡ [[Scopes]]: Scopes[2]
```

## HURLer

we need to transform the payload to align with the
object structure of the native DOM events ('popstate'
and 'DOMContentLoaded') payloads, so they're
transformed correctly by the `navigated$` stream
transforms

### Parameters

-   `ev`  

## \_\_SET_LINK_ATTRS_DOM

## `_SET_LINK_ATTRS_DOM`

Routing Command: DOM-specific

### Payload: function

default payload `args` signature:

    args: ({ DOM }) => ({ DOM }),

Input = DOM node reference

### Handler: side-effecting

Takes a DOM reference and queries all visited links. Sets
current/clicked link as active and sets visted links that
don't match current URL to inactive see `setLinkAttrs`
function

## \_\_HREF_PUSHSTATE_DOM

## `_HREF_PUSHSTATE_DOM`

Routing Command: DOM-specific

### Payload: function

default payload `args` signature:

    args: ({ URL, DOM }) => ({ URL, DOM }),

Takes a URL and a DOM reference

### Handler: side-effecting

If the DOM reference is an `<a>` element, uses
`history.pushState` to add the clicked URL (plus the
parsed URL from `parse_URL(URL)`) to the `history` object

export const DOMnavigated$ = merge({
  src: [popstate$, DOMContentLoaded$]
}).transform(map(x => ({ URL: x.target.location.href, DOM: x.currentTarget })))

## \_\_NOTIFY_PRERENDER_DOM

## `_NOTIFY_PRERENDER_DOM`

### Payload: static

default payload `args` signature

    args: true,

### Handler: side-effecting

Routing Command: DOM-specific (used for manually
triggering `rendertron` prerenderer for bots/web-crawlers

TODO: `jsdom` prerender testing

basic `http` server that returns static content for
certain user-agents

import { JSDOM } from "jsdom"

const document = (new JSDOM(...)).window.document
document.addEventListener("rendered", () => {...scrape
stuff here...
})

## og:title

og:url can tell scrapers to ignore the page and
scrape this instead. Would save scraping the whole
page and might be friendlier for `jsdom`

## FLIPFirst

order:
normalizeTree -> render -> diff -> init -> release
                | hdom |         | dom  | post-dom

have to think backwards:
1\. el mounted (init): look for existing flip map for id

-   if exists, Play anim and store new flip map rect (for navs)
-   if doesn't, nada

2.  el clicked (render.attrs.onclick): measure and store flip map for id
3.  el released: if clicked, calc flip rect and lookup for id:

-   if first === last, no change (on nav e.g.)
-   if first !== last, nav change (store rect for id)

### Parameters

-   `$0` **[Object][123]** 
    -   `$0.state`  
    -   `$0.id`  
    -   `$0.target`  

## zIndex

[https://coder-coder.com/z-index-isnt-working/][124]

### Parameters

-   `el`  
-   `idx`  

## FLIPLastInvertPlay

1.  if it has been clicked that means the last thing
    that happened was a click that triggered this init
    so we do the calcs

2.  if a back/nav (no frame) event was what triggered
    the init do the calcs with no frame

### Parameters

-   `$0` **[Object][123]** 
    -   `$0.element`  
    -   `$0.state`  
    -   `$0.id`  
    -   `$0.transition`   (optional, default `"all .3s cubic-bezier(.54,-0.29,.17,1.11)"`)

## L_flip_map

🔥 this may cause issues for parrallel anims append this
to a specific target using:
Array.from(el.querySelectorAll("[flip]")).forEach(x=>
if i last... el.scrollIntoView())

## state

What's happening:

-   on first click (render)
-   rect registered
-   frame registered
-   navs
-   on init of new DOM
-   checks for rect & frame
-   uses rect & frame to calc diff
-   PLAY

## fURL

# HREF/URL Parser

Takes an href (full or relative) and pulls out the various
components to be used for instrumentation of various
high-level event handling.

## Examples:

Ex1:

```js
parse_href("http://localhost:1234/about?get=some#today")
```

```js
{
  URL: "http://localhost:1234/about?get=some#today",
  URL_subdomain: [],
  URL_domain: ["localhost:1234"],
  URL_path: ["about"],
  URL_query: { get: "some" },
  URL_hash: "today"
}
```

Ex2:

```js
parse_href("https://github.com/thi-ng/umbrella/#blog-posts")
```

```js
{
  URL: 'https://github.com/thi-ng/umbrella/#blog-posts',
  URL_subdomain: [],
  URL_domain: ["github", "com"],
  URL_path: ["thi-ng", "umbrella"],
  URL_query: {},
  URL_hash: "blog-posts"
}
```

Ex3:

```js
parse_href("https://very-long-sub.dom.cloud.eu/site/my/happy/")
```

```js
{
  URL: 'https://very-long-sub.dom.cloud.eu/site/my/happy/',
  URL_subdomain: ["very-long-sub", "dom"],
  URL_domain: ["cloud", "eu"],
  URL_path: ["site", "my", "happy"],
  URL_query: {},
  URL_hash: ""
}
```

Ex4:

```js
parse_href("https://api.census.gov/data?get=NAME&in=state:01&in=county:*")
```

```js
{
  URL: "https://api.census.gov/data?get=NAME&in=state:01&in=county:*",
  URL_subdomain: ["api"],
  URL_domain: ["census", "gov"],
  URL_path: ["data"],
  URL_query: { get: "NAME", in: ["state:01", "county:*"] },
  URL_hash: ""
}
```

Ex5:

```js
parse_href("/data?get=NAME&in=state#indeed")
```

```js
{
  URL: "/data?get=NAME&in=state#indeed",
  URL_subdomain: [],
  URL_domain: [],
  URL_path: ["data"],
  URL_query: { get: "NAME", in: "state" },
  URL_hash: "indeed"
}
```

### Parameters

-   `_URL`  
-   `prefixRGX`  
-   `URL` **[string][125]** full or partial URL/href

## unfURL

`unparse_URL`

The reverse of `parse_URL` that enables talking to the
router with a friendlier API than having to always
construct URLs manually.

TODO: testing for `unparse_URL`

### Parameters

-   `parsed`  
-   `isAbsolute`   (optional, default `false`)

## stringify_type

### `stringify_type`

just a little convenience function
takes some value and returns a string representation of its type
this makes it easier to create a switch statement using types

powered by [@thi.ng/checks][126]

### Parameters

-   `x`  

## trace$

## `trace_stream`

simple ad-hoc tracer to log one of the streams emmissions

### Parameters

-   `log_prefix` **[string][125]** A string that is prepended to
                     console.log's of emissions from the
                     stream
-   `stream`  

## stringify_w_functions

Uses a JSON.stringify "replacer" function to preserve a
small (truncated) version of the function signature for
Object values that contain them

### Parameters

-   `x`  
-   `indent`  

## x_key_ERR

`uknown_key_ERR`

Just a  little error for people defining commands
that makes sure their keys don't contain typos

### Parameters

-   `str`  
-   `c`  
-   `unknown`  
-   `sub$`  
-   `index`  

## diff_keys

### Parameters

-   `nKeys`   (optional, default `[]`)
-   `nObj`   (optional, default `{}`)

## registered

## `registerCMD`

Takes a Command object with some additional information
and returns a Command usable in a Task or as-is. This
also serves the additional benefit of giving the user a
constant to use instead of making any typos in keys
during use.

### Destructuring Behavior

During a `sub$` registration, the keys in the Command
object are used to determine the signature of incoming
Commands. In order to reduce the amount of boilerplate
for Commands that only contain the `sub$` and `args` key,
the `args` key is
[pluck][127]ed
from the incoming Commands. This pulls the `args` value
out from the incoming Command objects to be used directly
(without the need for dstructuring).

### Example

```js
import { registerCMD, run$ } from "🍎"

const cmd_pathless = {
  sub$: "PATHLESS",
  args: { static: "payload" }
}

const pathless_handler = x => console.log("pathless ->", x)

const CMD_PATHLESS = registerCMD(cmd_pathless, pathless_handler)

run$.next(CMD_PATHLESS) // 🏃
// pathless -> { static: 'payload' }

const cmd_path = {
  sub$: "PATH",
  args: { static: "payload" },
  path: ["default", "path"]
}

const path_handler = x => console.log("path ->", x)

const CMD_PATH = registerCMD(cmd_path, path_handler)

run$.next(CMD_PATH) // 🏃
// path -> { args: { static: 'payload' }, path: [ 'default', 'path' ] }

const test_pathless = {
  sub$: "PATHLESS",
  args: "🔥"
}

run$.next(test_pathless) // 🏃
// pathless -> "🔥"
// as you can see, the Command args have been plucked out

const test_path = {
  sub$: "PATH",
  args: "🌊",
  path: ["new", "path"]
}

run$.next(test_path) // 🏃
// path -> { args: '🌊', path: [ 'new', 'path' ] }
// only the sub$ entry has been removed leaving the rest

// NOW: Let's stick these into a Task
let TASK_1 = [
  { ...CMD_PATH, path: "overwritten" },
  CMD_PATHLESS,
  { ...test_path, args: "🍝" }
]
run$.next(TASK_1)
// path -> { args: { static: 'payload' }, path: 'overwritten' }
// pathless -> { static: 'payload' }
// path -> { args: '🍝', path: [ 'new', 'path' ] }
```

### Parameters

-   `command` **Command** an object with four keys:
     1\. `sub$` (required)
     2\. `handler` (required)
     3\. `args` (optional, sets default) during registration
     4\. `source$` (optional, enables stream to feed Command)

## Error

destructure the args component out of the emissions
to save the user from having to do that PITA everytime

## registerRouterDOM

expects payload of

    { target: { location: { href } }, currentTarget }

### Parameters

-   `router`  

## boot

Part I: Needs to be a functional component to accept the
 `ctx` object to pass it to children

 Part II: Takes the root RAF stream and updates the shell
 on every global state mutation

 Part III: Connects the app shell to the state stream,
 which is triggered by any updates to the global
 `$store$`

### Parameters

-   `CFG`  

## isObject

## \_\_URL\_\_ROUTE

`_URL__ROUTE`

Universal router (cross-platform) Subtask.

This can be used in both a browser and Node context. The
parts that handle browser side-effects are included in an
Supertask `_URL__ROUTE`

Pseudo

    ( router ) => ({ URL }) => [
    - set `router_loading` path in global atom to `true`
    - call provided `router` with the `URL` and await payload
    - `parse_URL(URL)` for `URL_*` components
    - set `route_path` in global store/atom to current `URL_path`
    - set page state (data, path & page component name) in store
    - once promise(s) resolved, set `router_loading` to `false`
    ]

reserved Command keys:

-   `URL_page`
-   `URL_data`
-   `URL_path`
-   `URL`
-   `DOM`

### Parameters

-   `CFG`  

## erro\_

## `_SET_ROUTER_LOADING_STATE`cod

Routing Command: Universal

### Payload: static

default payload `args` signature:

    args: true,

Simple true or false payload to alert handler

### Handler: side-effecting

Sets `route_loading` path in global Atom to true || false

## args\_

## `_SET_ROUTER_PATH`

Routing Command: Universal

### Payload: function

default payload `args` signature:

    args: ({ URL_path }) => ({ URL_path }),

Consumes the `URL_path` property from a `parse_URL`
object, handed off from a prior Command

### Handler: side-effecting

Sets the current/loading router's `route_path` in the
global Atom

## args\_

takes the result from two sources: the user-provided
`router` ([@thi.ng/associative:
EquivMap][128]) and the `URL_path`
from `parse_URL(URL)`

### Handler: side-effecting

Hydrates the page state as well as the name of the active
page in the global store

## \_\_URL_DOM\_\_ROUTE

`_URL__ROUTE_DOM`

DOM Router that contains a cross-platform routing Subtask
`_URL__ROUTE`

Subtask HOF for router registration. Takes a
`@thi.ng/associative` `EquivMap` route matching function,
registers that router as a member of a Task for following
Commands to leverage the returned data (`{ data, page }`)

Pseudo

    ( router ) => ({ URL, DOM event }) => [
    - if href, push to `history.pushState`
    - SUBTASK: _URL__ROUTE (universal router)
    - remove `active` attribute from visited links except current
    - notify rendertron (TBD) of new page
    ]

reserved Command keys:

-   `URL`
-   `DOM`
-   `URL_page`
-   `URL_path`
-   `URL_data`

### Parameters

-   `CFG`  

## Streams

## run$

# Stream Architecture:

`run$` is the primary event stream exposed to the user
via the `ctx` object injected into every `hdom` component
the command stream is the only way the user changes
anything in `hurl`

## Marble Diagram

    0>- |------c-----------c--[~a~b~a~]-a----c-> : calls
    1>- |ps|---1-----------1----------0-1----1-> : run$
    2>- |t0|---------a~~b~~~~~~~~~~~a~*--------> : task$
    3>- |t1|---c-----------c------------a----c-> : command$
    4>- ---|ps|c-----a--b--c--------a---a----c-> : out$
    Handlers
    a>- ---|ta|------*--------------*---*------> : registerCMD
    b>- ---|tb|---------*----------------------> : registerCMD
    c>- ---|tc|*-----------*-----------------*-> : registerCMD

## Streams

-   `0>-`: `ctx.run$.next(x)` userland dispatches
-   `1>-`: `pubsub({ topic: x => x.length === 0 })` `run$`
    stream
-   `2>-`: pubsub = `false` ? -> `task$` stream
-   `3>-`: pubsub = `true` ? ->`command$` stream
-   `4>-`: `pubsub({ topic: x => x.sub$ })`: `out$` stream
    \-> `register_command`

## Handlers

`4>-` this is the stream to which the user (and
framework) attaches handlers. Handlers receive events
they subscribe to as topics based on a `sub$` key in a
Command object.

### Handlers (framework provided):

-   "state": Global state mutations
-   "route": Routing
-   "FLIP" :
    [F.L.I.P.][129]
    animations

TODO:

-   add **Examples**
-   add `beforeunload` event handler within #4 (orphan):
     SEE [https://youtu.be/QQukWZcIptM][130]
-   enable ctx.run.cancel() via external or internal events
     (e.g., popstate / { sub$:  "cancel" })

## `run$`

User-land event dispatch stream

This stream is directly exposed to users via `ctx` Any
one-off Commands `next`ed into this stream are sent to
the `command$` stream. Arrays of Commands (Tasks) are
sent to the `task$` stream.

## out$

## `out$`

Primary user-land _READ_ stream. For attaching handlers
for responding to emmitted Commands

## command$

## `command$`

Primary fork/bisect stream for indivual commands.
attached to a `pubsub` stemming from this stream. The
`topic` function used to alert downstream handlers is a
simple lookup of the `sub$` key of the command

## task$

## `task$`

Batch processing stream, listens for Tasks sent as an
array of Commands (including subtask functions)

stream (if array of event objects)

## DOMnavigated$

There are three types of navigation we need to handle:
1\. DOMContentLoaded (entering the site) events
2\. popstate (browser back/forward button clicks) events
3\. `<a hurl="x">` (link clicking)

These events have different payloads and need to be
harmonized in order to use them consistently

## getting the `hurl` property from the various events:

1.  ev.target.location.hurl
2.  ev.target.location.hurl
3.  ev.target.hurl

for raw events, we can just transform them, but for link
clicking we need to convert/wrap it to align with the
destructuring of the others

see \_HURL in `/commands/routing.js` for ad-hoc stream
injection example

## spule

## spule

## `spool`

### TL;DR:

Handles Collections (array) of Commands ("Tasks") which
require _ordered_ choreography and/or have a dependency
on some (a)sync data produced by a user interaction.

### Synopsis:

-   Async `reduce` function, that passes an accumulator
    (`acc`) as a local state container between Command
    invocations.
-   Commands are composed in-situ in userland (Ad hoc)
-   spools a collection of Commands as a Task
-   resolves any promises contained within a Command
-   passes an accumulator (acc) to subsequent Commands in a
    Task

### Type checks on function signatures

There are two valid forms for Task entries:
1\. a Unary function returning an array of Commands:
   referred to as "Subtasks"
2\. A Command object: dispatch to registered handlers

## Recognized Keys

There are 4 recognized keys for a Command object:

### Primary keys

##### `sub$` key

-   Topic identifier: used for registering handlers hooked
     onto the Command stream.

##### `args` key

-   **primary control structure** with three recognized
    forms that do different things in the context of a
    Task:
-   non-function `args` (primitives, objects) send the args
    as-is to the Command handler
-   nullary fns (`(0)=>` ) send the args_ as a Command to
    a `sub$` \_stream_ of your choosing (ADVANCED: see
    Ad-hoc Stream Injection below)
-   unary fns (`(1)=>`) are passed the inter-Task
    accumulated value, called and the resulting value is
    passed to registered Command handler
-   Promises (and those returned from `(1)=>`) are resolved
    and their values sent to the handler
-   new vals (Objects) are merged with accumulated object
    from preceding Task results(dupe keys overwritten)

### Promise-specific keys -> binary (as in two parameter,

  not boolean) functions:

##### `reso` key

-   (resolving) function `(2)=>` = handle resolved
    promises: MUST be a binary fn `(acc, resolved Promise)
    =>`

##### `erro` key

-   `(2)=>` = handle rejected promises: MUST be
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

#### Use:

```js
import { run$ } from "hurl"

export const run = e => run$.next(e);

//... 📌 TODO...
```

### Ad-hoc stream injection

ADVANCED USE ONLY 👽

HURL tries to hide the stream implentation from the user
as much as possible, but allows you to go further down
the rabbit hole if so desired. You may send Commands to a
separate stream of your own creation during a Task by
using a nullary ("thunk") `(0)=>` function signature as
the `args` value of a Command. If this is the case, the
spool assumes the `sub$` key references a stream and
sends the return value of the thunk to that stream

> Note: if you need to pass the accumulator to your
> thunk, put it in a subtask, where you can
> access/destructure the data from the acc passed into the
> subtask function

```js
import { stream, trace } from "@thi.ng/rstream"

// ad-hoc stream
let login = stream().subscribe(trace("login ->"))

// task
let task = [
 { args: { href: "https://my.io/auth" } }, // <- no sub$, just pass data
 { sub$: login , args: () => "logging in..." },
 { sub$: "AUTH"
 , args: ({ href }) => fetch(href).then(r => r.json())
 , erro: (acc, err) => ({ sub$: "cancel", args: err })
 , reso: (acc, res) => ({ token: res }) },
 acc => subtask_login(acc),
 { sub$: login , args: () => "log in success" }
]

// subtask
let subtask_login = ({ token }) => [
 { sub$: login // <- stream
 , args: () => ({ token }) } // <- use acc
]
```

\*

### Parameters

-   `task_array`  

## HURL

## err_str

There're only 3 lifecycle hooks. render is called for
every update and is just providing the actual hiccup for
that component. if that component is used the first time,
the order is normalizeTree ->  render -> diff ->  init.
The actual DOM element is only known when init is called,
NEVER during render (though you could cache it as local
component state). If during diffing it turns out the
component is not used anymore, then release will be
called

if the object identity of your life cycle component
changes with every update then that count as full
replacement and would trigger init each time:

[https://github.com/thi-ng/umbrella/wiki/Higher-order-components][131]

init is called in so called "post-order", i.e. when it
executes all children are already present in the DOM (and
might have had their init hooks called) first time = 1st
frame the component appears in the DOM

### Parameters

-   `prop`  

## constants

## DEFAULT_CFG

parse_URL constants

| URL component key | description                            |
| ----------------- | -------------------------------------- |
| DOM               | DOM node target                        |
| URL               | full URL/route                         |
| URL_path          | route path as array                    |
| URL_domain        | top-level domain as array              |
| URL_subdomain     | subdomain as array                     |
| URL_query         | node querystring parsed URL parameters |
| URL_hash          | hash string to/from URL if any         |
| URL_data          | data returned by router                |
| URL_page          | page component to render URL_data with |

| router config key | description                                      |
| ----------------- | ------------------------------------------------ |
| HEAD              | metadata wrapper for router (targets DOM <head>) |
| BODY              | data wrapper for router                          |
| prep              | pre-router behavior Task/Command injection       |
| post              | post=router behavior Task/Command injection      |
| prefix            | URL path string for the router to ignore         |
| router            | @thi.ng/EquivMap pattern matching function       |

| Command key | description                                                  |
| ----------- | ------------------------------------------------------------ |
| sub$        | Command primary/unique key (topic subscription)              |
| args        | multiple signature intra-Task Command state see [Spule][132] |
| reso        | intra-Command resolver of Promise args                       |
| erro        | intra-Command handler for Promise args rejetions             |
| handler     | where Commands' actual "work" is done (side-fx/mutations)    |
| source$     | upstream (source stream) Command connector                   |

| boot config key | description                                 |
| --------------- | ------------------------------------------- |
| run             | primary userland dispatch function          |
| state           | global immutable state container            |
| root            | DOM mount node for application              |
| app             | root application view                       |
| trace           | enable logging of every global state update |
| draft           | state shape scaffolding                     |

## Atom

## set$$tate

## `set$$tate`

Swaps the current value at the given path/lens into the
global store with that of the given value. Checks to see
if that value should be either spread into an existing
object or a complete replacement

### Parameters

-   `path`  
-   `val`  

[1]: #registercmd

[2]: #all

[3]: #examples

[4]: #registercmd-1

[5]: #all-1

[6]: #examples-1

[7]: #registercmd-2

[8]: #all-2

[9]: #examples-2

[10]: #registercmd-3

[11]: #all-3

[12]: #examples-3

[13]: #hurler

[14]: #parameters

[15]: #__set_link_attrs_dom

[16]: #_set_link_attrs_dom

[17]: #payload-function

[18]: #handler-side-effecting

[19]: #__href_pushstate_dom

[20]: #_href_pushstate_dom

[21]: #payload-function-1

[22]: #handler-side-effecting-1

[23]: #__notify_prerender_dom

[24]: #_notify_prerender_dom

[25]: #payload-static

[26]: #handler-side-effecting-2

[27]: #ogtitle

[28]: #flipfirst

[29]: #parameters-1

[30]: #zindex

[31]: #parameters-2

[32]: #fliplastinvertplay

[33]: #parameters-3

[34]: #l_flip_map

[35]: #state

[36]: #furl

[37]: #hrefurl-parser

[38]: #examples-4

[39]: #parameters-4

[40]: #unfurl

[41]: #parameters-5

[42]: #stringify_type

[43]: #stringify_type-1

[44]: #parameters-6

[45]: #trace

[46]: #trace_stream

[47]: #parameters-7

[48]: #stringify_w_functions

[49]: #parameters-8

[50]: #x_key_err

[51]: #parameters-9

[52]: #diff_keys

[53]: #parameters-10

[54]: #registered

[55]: #registercmd-4

[56]: #destructuring-behavior

[57]: #example

[58]: #parameters-11

[59]: #error

[60]: #registerrouterdom

[61]: #parameters-12

[62]: #boot

[63]: #parameters-13

[64]: #isobject

[65]: #__url__route

[66]: #parameters-14

[67]: #erro_

[68]: #_set_router_loading_statecod

[69]: #payload-static-1

[70]: #handler-side-effecting-3

[71]: #args_

[72]: #_set_router_path

[73]: #payload-function-2

[74]: #handler-side-effecting-4

[75]: #args_-1

[76]: #handler-side-effecting-5

[77]: #__url_dom__route

[78]: #parameters-15

[79]: #streams

[80]: #run

[81]: #stream-architecture

[82]: #marble-diagram

[83]: #streams-1

[84]: #handlers

[85]: #handlers-framework-provided

[86]: #run-1

[87]: #out

[88]: #out-1

[89]: #command

[90]: #command-1

[91]: #task

[92]: #task-1

[93]: #domnavigated

[94]: #getting-the-hurl-property-from-the-various-events

[95]: #spule

[96]: #spule-1

[97]: #spool

[98]: #tldr

[99]: #synopsis

[100]: #type-checks-on-function-signatures

[101]: #recognized-keys

[102]: #primary-keys

[103]: #sub-key

[104]: #args-key

[105]: #promise-specific-keys---binary-as-in-two-parameter

[106]: #reso-key

[107]: #erro-key

[108]: #subtasks

[109]: #pseudo

[110]: #example-1

[111]: #use

[112]: #ad-hoc-stream-injection

[113]: #parameters-16

[114]: #hurl

[115]: #err_str

[116]: #parameters-17

[117]: #constants

[118]: #default_cfg

[119]: #atom

[120]: #settate

[121]: #settate-1

[122]: #parameters-18

[123]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[124]: https://coder-coder.com/z-index-isnt-working/

[125]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[126]: http://thi.ng/checks

[127]: https://github.com/thi-ng/umbrella/blob/master/packages/transducers/src/xform/pluck.ts

[128]: http://thi.ng/associative

[129]: https://aerotwist.com/blog/flip-your-animations/

[130]: https://youtu.be/QQukWZcIptM

[131]: https://github.com/thi-ng/umbrella/wiki/Higher-order-components

[132]: <>
