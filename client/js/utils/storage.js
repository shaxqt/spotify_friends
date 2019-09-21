const getFromStorage = key => {
  if (!key) {
    return null
  }
  try {
    const valueStr = localStorage.getItem(key)
    if (valueStr) {
      return JSON.parse(valueStr)
    }
    return null
  } catch (err) {
    return null
  }
}
const setInStorage = (key, obj) => {
  if (!key) {
    console.error('key is missing')
  }
  try {
    localStorage.setItem(key, JSON.stringify(obj))
  } catch {
    console.error(err)
  }
}

module.exports = { getFromStorage, setInStorage }
