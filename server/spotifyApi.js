const requestLib = require('request')
const database = require('./database')

const { client_secret, client_id } = require('./config/config')

const getSpotifyUserInfo = (session, url = '/v1/me') => {
  return new Promise((resolve, reject) => {
    requestSpotifyUserInfo(session.spotify_access_token, url)
      .then(body => resolve(body))
      .catch(err => {
        // refresh token and try again
        refreshSpotifyToken(session)
          .then(session => {
            console.log('getSpotifyUserInfo try again with refreshed token')
            requestSpotifyUserInfo(session)
              .then(body => resolve(body))
              .catch(err => reject(err))
          })
          .catch(err => reject(err))
      })
  })
}
const getSessionFromToken = token => {
  return new Promise((resolve, reject) => {
    if (token == null || token === '') {
      console.log('getSessionFromToken no token given')
      reject('no token given')
    } else {
      database
        .getUserSession(token)
        .then(session => resolve(session))
        .catch(err => reject(err))
    }
  })
}
/*
 * checks if spotify tokens in given session are working
 * does not reject, resolves in true or false
 */
const isUserSessionValid = (session, token) => {
  return new Promise((resolve, reject) => {
    getSpotifyUserInfo(session, '/v1/me')
      .then(body => {
        if (body) {
          console.log('isUserSessionValid is VALID, id: ', body.id)
          resolve(true)
        } else {
          console.log('isUserSessionValid is INVALID id: ', body.id)
          resolve(false)
        }
      })
      .catch(err => resolve(false))
  })
}

const handleUserLogin = (token, refresh, expires) => {
  return new Promise((resolve, reject) => {
    requestSpotifyUserInfo(token, '/v1/me')
      .then(spotifyResponse => {
        if (spotifyResponse) {
          database
            .getOrCreateUser(spotifyResponse)
            .then(user => {
              database
                .createUserSession(user, token, refresh, expires)
                .then(session => {
                  console.log('handleUserLogin created session')
                  resolve(session._id)
                })
            })
            .catch(err => reject(err))
        } else {
          reject('no response body')
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

const isTokenValid = token => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session => {
        isUserSessionValid(session)
          .then(isValid => resolve(isValid))
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}
function requestSpotifyUserInfo(token, url) {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://api.spotify.com' + url,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    }
    console.log('requestSpotifyUserInfo url: ' + url)

    requestLib.get(options, function(error, response, body) {
      if (response.statusCode && response.statusCode === 204) {
        console.log('requestSpotifyUserInfo reject no content')
        resolve('no content') // not an error
      } else if (error) {
        console.log('requestSpotifyUserInfo reject error')
        reject(error)
      } else if (body) {
        if (body.error != null) {
          // could means token is expired
          console.log('requestSpotifyUserInfo reject body.error')
          reject(body.error)
        } else {
          console.log('requestSpotifyUserInfo resolve body', body.id)
          resolve(body)
        }
      } else {
        console.log('requestSpotifyUserInfo reject unhandled case')
        reject('unhandled case')
      }
    })
  })
}

function refreshSpotifyToken(session) {
  return new Promise((resolve, reject) => {
    console.log('refreshSpotifyToken for session id: ' + session._id)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token: session.spotify_refresh_token,
        grant_type: 'refresh_token'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    }

    requestLib.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const spotify_access_token = body.access_token
          ? body.access_token
          : null
        const spotify_expires_in = body.expires_in ? body.expires_in : null

        if (spotify_access_token && spotify_expires_in) {
          database
            .updateUserSession(session, {
              spotify_access_token,
              spotify_expires_in
            })
            .then(session => resolve(session))
            .catch(err => reject(err))
        } else {
          console.log('refreshSpotifyToken reject, got no new token')
          reject({ spotify_access_token, spotify_expires_in })
        }
      } else {
        console.log('refreshSpotifyToken reject, error in post')
        reject({ error: error, statusCode: response.statusCode })
      }
    })
  })
}

module.exports = {
  getSpotifyUserInfo,
  getSessionFromToken,
  isUserSessionValid,
  handleUserLogin,
  isTokenValid
}
