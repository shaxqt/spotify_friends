const requestLib = require('request')
const database = require('./database')

const { client_secret, client_id } = require('./config/config')

const getSpotifyUserInfo = (session, url = '/v1/me') => {
  return new Promise((resolve, reject) => {
    // get new token if its expired
    if (session.spotify_expires_at < Date.now()) {
      refreshSpotifyToken(session)
        .then(session =>
          requestSpotifyUserInfo(session.spotify_access_token, url)
        )
        .then(body => resolve(body))
        .catch(err => reject(err))
    } else {
      requestSpotifyUserInfo(session.spotify_access_token, url)
        .then(body => resolve(body))
        .catch(err => reject(err))
    }
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

const isUserSessionValid = session => {
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
            .then(user =>
              database.createUserSession(user, token, refresh, expires)
            )
            .then(session => {
              console.log('handleUserLogin created session')
              resolve(session._id)
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

const getContacts = token => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session => database.getContacts(session))
      .then(contacts => resolve(contacts))
      .catch(err => reject(err))
  })
}
const getContactRequests = token => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session => database.getContactRequests(session, { status: 0 }))
      .catch(err => reject(err))
      .then(contacts => resolve(contacts))
      .catch(err => reject(err))
  })
}
const retractContact = (token, target) => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session => database.removeContact(session, target))
      .catch(err => reject(err))
      .then(contact => resolve(contact))
      .catch(err => reject(err))
  })
}
const createContact = (token, target, message) => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session => database.createContact(session, target, message))
      .catch(err => reject(err)) // Kann das weg?
      .then(contact => resolve(contact))
      .catch(err => reject(err))
  })
}
const updateContactRequest = (token, contact_id, newValue) => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session =>
        database.updateContactRequest(session, contact_id, newValue)
      )
      .catch(err => reject(err))
      .then(contact => resolve(contact))
      .catch(err => reject(err))
  })
}
const getUsersByDisplayName = (token, search) => {
  return new Promise((resolve, reject) => {
    let session = null
    getSessionFromToken(token)
      .then(sessionFromToken => {
        session = sessionFromToken
        return isUserSessionValid(session)
      })
      .then(isValid => {
        if (isValid) {
          database
            .getUsersByDisplayName(search, session)
            .then(users => resolve(users))
            .catch(err => reject(err))
        } else {
          reject('token invalid')
        }
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
      if (error) {
        reject(error)
      } else {
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
            //log items or body id (spotify username)
            let log = ''
            if (body.id) {
              log = ' body.id = ' + body.id
            } else if (body.items) {
              log = ' body.items.length = ' + body.items.length
            }
            console.log('requestSpotifyUserInfo resolve' + log)
            resolve(body)
          }
        } else {
          console.log('requestSpotifyUserInfo reject unhandled case')
          reject('unhandled case')
        }
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
        const { expires_in, access_token } = body

        if (access_token && expires_in) {
          console.log('refreshSpotifyToken ', Date.now())
          console.log('refreshSpotifyToken ', Date.now() + Number(expires_in))
          database
            .updateUserSession(session, {
              spotify_access_token: access_token,
              spotify_expires_at: Date.now() + Number(expires_in * 1000)
            })
            .then(session => resolve(session))
            .catch(err => reject(err))
        } else {
          console.log('refreshSpotifyToken reject, got no new token')
          reject({ spotify_access_token, spotify_expires_in })
        }
      } else {
        console.log(
          'refreshSpotifyToken reject, error',
          response.statusCode,
          body
        )
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
  getContacts,
  createContact,
  getContactRequests,
  updateContactRequest,
  getUsersByDisplayName,
  retractContact
}
