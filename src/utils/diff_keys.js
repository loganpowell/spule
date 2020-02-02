/** @format */

export function diff_keys(nKeys = [], nObj = {}) {
  let all = Object.keys(nObj)
  let xKeys = all.filter(key => !nKeys.includes(key))
  let xObj = Object.entries(nObj).reduce((a, [k, v]) => {
    if (!nKeys.includes(k)) return { ...a, [k]: v }
    else return a
  }, {})
  return [xKeys, xObj]
}

diff_keys(["a", "b"], { a: 1, b: 2, c: 3, d: 4 }) //?
diff_keys([1, 2, 3]) //?
