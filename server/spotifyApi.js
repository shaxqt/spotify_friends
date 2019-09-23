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

const isUserSessionValid = (token, tryHard = false) => {
  return new Promise((reject, resolve) => {
    database
      .getUserSession(token)
      .then(session => {
        if (tryHard) {
          getSpotifyUserInfo(session, '/v1/me')
            .then(body => {
              if (body) {
                resolve(true)
              } else {
                resolve(false)
              }
            })
            .catch(err => reject(err))
        } else {
          resolve(true)
        }
      })
      .catch(err => reject(err))
  })
}

const handleUserLogin = (token, refresh, expires) => {
  return new Promise((resolve, reject) => {
    requestSpotifyUserInfo(token, '/v1/me')
      .then(spotifyResponse => {
        console.log('######### GOT SPOTIFY RESPONSE')
        if (spotifyResponse) {
          database.getOrCreateUser(body).then(user => {
            database
              .createUserSession(user, token, refresh, expires)
              .then(session => {
                console.log('handleUserLogin created session')
                resolve(session._id)
              })
          })
        } else {
          reject('no response body')
        }
      })
      .catch(err => {
        console.log('########### BIN IM CATCH')
        reject(err)
      })
      .finally(() => console.log('########## BIN iM FINALLY'))

    // TODO cant get in then() catch() or finally()
  })
}

function requestSpotifyUserInfo(token, url) {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://api.spotify.com' + url,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    }
    console.log('requestSpotifyUserInfo')

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
          console.log('requestSpotifyUserInfo resolve body')
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
    console.log('refreshSpotifyToken for session', session)
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
            .then(session => {
              console.log('refreshSpotifyToken resolve newSession')
              resolve(session)
            })
            .catch(err => {
              console.log('refreshSpotifyToken reject error')
              reject(err)
            })
        } else {
          reject({ spotify_access_token, spotify_expires_in })
        }
      } else {
        reject({ error: error, statusCode: response.statusCode })
      }
    })
  })
}
module.exports = { handleUserLogin, isUserSessionValid, getSpotifyUserInfo }
