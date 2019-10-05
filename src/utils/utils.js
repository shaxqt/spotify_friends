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

export function findReplaceById(array, item, replace) {
  const toReplace = array.find(contact => contact.id === item.id)[0]

  const index = array.indexOf(toReplace)
  const newResult = [
    ...array.slice(0, index),
    replace,
    ...array.slice(index + 1)
  ]
  return newResult
}
