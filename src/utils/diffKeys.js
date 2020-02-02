export function diffKeys(nKeys = [], nObj = {}) {
  let all = Object.keys(nObj)
  let xKeys = all.filter(key => !nKeys.includes(key))
  let xObj = Object.entries(nObj).reduce((a, [k, v]) => {
    if (!nKeys.includes(k)) return { ...a, [k]: v }
    else return a
  }, {})
  return [xKeys, xObj]
}

diffKeys(["a", "b"], { a: 1, b: 2, c: 3, d: 4 }) //?
diffKeys([1, 2, 3]) //?
