const requestLib = require('request')
const { host } = require('../config/config')
const database = require('./database')

const spotifyMeGet = (spotify_friends_token, url) => {
  console.log('called')
  return new Promise((resolve, reject) => {
    database
      .getUserSession(spotify_friends_token)
      .then(session => {
        // make request with spotify token from UserSession
        callSpotifyAPI(session.spotify_access_token, url)
          .then(body => resolve(body))
          .catch(error => {
            if (error.status === 401) {
              // if token expired, try to use refresh token
              refreshSpotifyToken(session)
                .then(session => {
                  // make request again with updated UserSession token
                  callSpotifyAPI(session.spotify_access_token, url)
                    .then(body => resolve(body))
                    .catch(error => reject(error))
                })
                .catch(error => reject(error))
            }
          })
      })
      .catch(error => reject(error))
  })
  function refreshSpotifyToken(session) {
    return new Promise((resolve, reject) => {
      const authOptions = {
        url: host + '/auth/token',
        body: {
          refresh_token: session.spotify_refresh_token,
          grant_type: 'refresh_token'
        },
        json: true
      }
      requestLib.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          const spotify_access_token = body.access_token
            ? body.access_token
            : null
          const spotify_expires_in = body.expires_in ? body.expires_in : null

          console.log(
            'refreshSpotifyToken',
            spotify_expires_in,
            spotify_access_token
          )
          if (spotify_access_token && spotify_expires_in) {
            database
              .updateUserSession(session, {
                spotify_access_token,
                spotify_expires_in
              })
              .then(session => resolve(session))
              .catch(error => reject(error))
          } else {
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
}

const verifyUserSession = token => {
  return new Promise((resolve, reject) => {
    database
      .getUserSession(token)
      .then(session => {
        if (
          session.userID &&
          session.spotify_access_token &&
          session.spotify_refresh_token
        ) {
          resolve(true)
        } else {
          reject(false)
        }
      })
      .catch(error => reject(error))
  })
}

const handleUserLogin = (token, refresh, expires) => {
  return new Promise((resolve, reject) => {
    callSpotifyAPI(token, '/v1/me')
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
function callSpotifyAPI(token, url) {
  return new Promise((resolve, reject) => {
    console.log('callSpotifyAPI' + url)
    const options = {
      url: 'https://api.spotify.com' + url,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    }
    requestLib.get(options, function(error, response, body) {
      if (!error) {
        if (!body.error) {
          console.log('callSpotifyAPI resolve', body)
          resolve(body)
        } else {
          console.log('callSpotifyAPI reject', body.error)
          reject(body.error)
        }
      } else {
        console.log('callSpotifyAPI reject', error)
        reject(error)
      }
    })
  })
}
module.exports = { handleUserLogin, verifyUserSession, spotifyMeGet }
/*

export function getCurrPlayingSong(access_token) {
  const options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true
  }

  // use the access token to get curr playing song
  requestLib.get(options, function(error, response, body) {
    console.log('ANTWORT VON v1/me/player/currently-playing', body)
  })
}
 */

function refrshSpotifyToken(session) {
  return new Promise((resolve, reject) => {
    const authOptions = {
      url: host + '/auth/token',
      form: {
        refresh_token: session.spotify_refresh_token,
        grant_type: 'refresh_token'
      },
      json: true
    }
    requestLib.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const spotify_access_token = body.access_token
          ? body.access_token
          : null
        const spotify_expires_in = body.expires_in ? body.expires_in : null

        if (spotify_acess_token && spotify_expires_in) {
          database
            .updateUserSession(session, {
              spotify_access_token,
              spotify_expires_in
            })
            .then(session => resolve(session))
            .catch(error => reject(error))
        } else {
          reject(
            'Kein neues token bekommen: ' +
              spotify_acess_token +
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
