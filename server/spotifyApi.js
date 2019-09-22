const requestLib = require('request')
const database = require('./database')

const { client_secret, client_id } = require('./config/config')
/*
 * performs a get request to the spotify api
 * to get user related information.
 * trys to refresh the spotify token, if its expired
 */
const getSpotifyUserInfo = (spotify_friends_token, url) => {
  return new Promise((resolve, reject) => {
    database
      .getUserSession(spotify_friends_token)
      .then(session => {
        // make request with spotify token from UserSession
        requestSpotifyUserInfo(session.spotify_access_token, url)
          .then(body => resolve(body))
          .catch(error => {
            if (error.status === 401) {
              // if token expired, try to use refresh token
              refreshSpotifyToken(session)
                .then(session => {
                  // make request again with updated UserSession token
                  requestSpotifyUserInfo(session.spotify_access_token, url)
                    .then(body => resolve(body))
                    .catch(error => reject(error))
                })
                .catch(error => reject(error))
            }
          })
      })
      .catch(error => reject(error))
  })
}
/*
 * this function simply return true or false
 * dependend on the given token (id of a UserSession)
 */
const isUserSessionValid = (token, tryHard = false) => {
  return new Promise((resolve, reject) => {
    console.log('isUserSessionValid', token, 'tryhard: ' + tryHard)
    database
      .getUserSession(token)
      .then(session => {
        if (
          session.userID &&
          session.spotify_access_token &&
          session.spotify_refresh_token
        ) {
          if (tryHard) {
            // try to use session to get informatin from spotify
            getSpotifyUserInfo(token, '/v1/me')
              .then(body => resolve(body.id === session.id))
              .catch(error => reject(false))
          } else {
            resolve(true)
          }
        } else {
          reject(false)
        }
      })
      .catch(error => reject(error))
  })
}
/*
 * this function gets user information from spotify,
 * using the given token.
 * It gets or create a User related to the given spotify-token.
 * Spotify tokens will be stored in UserSession and function return "own" token
 * (id of the UserSession)
 */
const handleUserLogin = (token, refresh, expires) => {
  return new Promise((resolve, reject) => {
    requestSpotifyUserInfo(token, '/v1/me')
      .then(body => {
        database
          .getOrCreateUser(body)
          .then(user => {
            database
              .createUserSession(user, token, refresh, expires)
              .then(token => resolve(token))
          })
          .catch(error => reject(error))
      })
      .catch(error => reject(error))
  })
}
/*
 * this function actually performs the get request to the spotify,
 * with the given token to the given url
 */
function requestSpotifyUserInfo(token, url) {
  return new Promise((resolve, reject) => {
    console.log('requestSpotifyUserInfo' + url)
    const options = {
      url: 'https://api.spotify.com' + url,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    }
    requestLib.get(options, function(error, response, body) {
      if (!error) {
        if (!body.error) {
          console.log(
            'requestSpotifyUserInfo resolve body',
            body.items ? body.items.length : body.href
          )
          resolve(body)
        } else {
          console.log('requestSpotifyUserInfo reject body.error', body.error)
          reject(body.error)
        }
      } else {
        console.log('requestSpotifyUserInfo reject error', error)
        reject(error)
      }
    })
  })
}
/*
 * this function trys to get a new access_token from spotify,
 * using the refresh_token from the given session.
 * updates the session and return it, if successful
 */
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
              console.log('refreshSpotifyToken resolve new session', session)
              resolve(session)
            })
            .catch(error => {
              console.log('refreshSpotifyToken reject, error', error)
              reject(error)
            })
        } else {
          console.log('refreshSpotifyToken no token, body', body)
          reject(
            'Kein neues token bekommen: ' +
              spotify_access_token +
              ' ' +
              spotify_expires_in
          )
        }
      } else if (error) {
        reject(error)
      } else {
        reject('status code' + response.statusCode)
      }
    })
  })
}
module.exports = { handleUserLogin, isUserSessionValid, getSpotifyUserInfo }
