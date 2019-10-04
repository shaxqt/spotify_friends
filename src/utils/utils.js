export function findRemove(array, item) {
  const index = array.indexOf(item)
  const newResult = [...array.slice(0, index), ...array.slice(index + 1)]
  return newResult
}
export function findReplace(array, item, replace) {
  const index = array.indexOf(item)
  const newResult = [
    ...array.slice(0, index),
    replace,
    ...array.slice(index + 1)
  ]
  return newResult
}
