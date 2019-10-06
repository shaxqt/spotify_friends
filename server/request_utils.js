const requestLib = require('request')

const putSpotifyRequest = (spotify_token, url, body) => {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: 'https://api.spotify.com' + url,
      headers: { Authorization: 'Bearer ' + spotify_token },
      json: true,
      body: body
    }
    requestLib.put(authOptions, function(error, res, body) {
      console.log('putSpotifyRequest', authOptions.url, res.statusCode)
      if (!error && (res.statusCode == 200 || res.statusCode == 401)) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}
const postSpotifyRequest = (url = '/api/token', form, headers) => {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: 'https://accounts.spotify.com' + url,
      form: form,
      json: true,
      headers: headers
    }
    requestLib.post(authOptions, function(error, res, body) {
      console.log('postSpotifyRequest', authOptions.url, res.statusCode)
      if (!error && (res.statusCode == 200 || res.statusCode == 401)) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}
const getSpotifyRequest = (token, url = '/v1/me') => {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: 'https://api.spotify.com' + url,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    }
    requestLib.get(authOptions, function(error, res, body) {
      console.log('getSpotifyRequest', authOptions.url, res.statusCode)
      if (
        !error &&
        (res.statusCode == 200 ||
          res.statusCode == 204 ||
          res.statusCode == 401)
      ) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

module.exports = { getSpotifyRequest, postSpotifyRequest, putSpotifyRequest }
