/** @format */

export function diff_keys(nKeys = [], nObj = {}) {
  const all = Object.keys(nObj)
  const xKeys : any = all.filter(key => !nKeys.includes(key))
  const xObj = Object.entries(nObj).reduce((a, [k, v]) => {
    if (!nKeys.includes(k)) return { ...a, [k]: v }
    else return a
  }, {})
  return [xKeys, xObj]
}

// diff_keys(["a", "b"], { a: 1, b: 2, c: 3, d: 4 }) //?
// diff_keys([1, 2, 3]) //?
