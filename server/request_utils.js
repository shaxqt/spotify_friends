const requestLib = require('request')

const postRequest = authOptions => {
  return new Promise((resolve, reject) => {
    requestLib.post(authOptions, function(error, res, body) {
      console.log('postRequest', authOptions.url, res.statusCode)
      if (!error && (res.statusCode == 200 || res.statusCode == 401)) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}
const getRequest = authOptions => {
  return new Promise((resolve, reject) => {
    requestLib.get(authOptions, function(error, res, body) {
      console.log('getRequest', authOptions.url, res.statusCode)
      if (!error && (res.statusCode == 200 || res.statusCode == 401)) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = { getRequest, postRequest }
