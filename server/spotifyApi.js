const requestLib = require('request')
const database = require('./database')

const { client_secret, client_id } = require('./config/config')

const startPlayback = async (token, body) => {
  try {
    session = await getSessionFromToken(token)
    if (session) {
      const res = await putSpotifyUserInfo(
        session.spotify_access_token,
        '/v1/me/player/play',
        body
      )
      return res
    }
  } catch (err) {
    return err
  }
}
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
const getCurrentSong = async (token, userID) => {
  try {
    const session = await getValidUserSession(token, userID)
    if (session == null) {
      return 'no session for userID ' + userID
    } else {
      const currSong = await requestSpotifyUserInfo(
        session.spotify_access_token,
        '/v1/me/player/currently-playing'
      )
      if (currSong.item) {
        // save to db and return curr song
        const savedSong = await database.updateCurrSong(userID, currSong)
        const mapped = mapCurrSong(savedSong)
        return mapped
      } else {
        // update currSong in DB
        const savedSong = await database.getCurrSong(userID)
        const mapped = mapCurrSong(savedSong, false)
        return mapped
      }
    }
  } catch (err) {
    console.log(err)
    return err
  }
}
function mapCurrSong(currSong, isPlaying) {
  if (
    currSong &&
    currSong.item &&
    currSong.item.album &&
    currSong.item.artists
  ) {
    const mapped = {
      next_fetch_in_ms: currSong.item.duration_ms - currSong.progress_ms,
      album_type: currSong.item.album.album_type,
      album: currSong.item.album.name,
      images: currSong.item.album.images,
      artists: currSong.item.artists.map(artist => artist.name),
      is_local: currSong.item.is_local,
      name: currSong.item.name,
      currently_playing_type: currSong.currently_playing_type,
      is_playing: isPlaying !== undefined ? isPlaying : currSong.is_playing,
      timestamp: currSong.timestamp,
      position_ms: currSong.progress_ms,
      context_uri: currSong.context.uri,
      context_type: currSong.context.type,
      uri: currSong.item.uri
    }
    return mapped
  } else {
    return null
  }
}
const getValidUserSession = async (token, userID) => {
  try {
    session = await getSessionFromToken(token)
    if (session) {
      const sessions = await database.getAllUserSessions(userID)
      sessions.sort((a, b) => b.timestamp - a.timestamp)
      for (const session of sessions) {
        if (await isUserSessionValid(session)) {
          return session
        }
      }
    }
  } catch (err) {
    return err
  }
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
          console.log('session ' + session._id + ' is valid')
          resolve(true)
        } else {
          console.log('session ' + session._id + ' is invalid')
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
      .catch(err => reject(err))
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
const updateContactRequest = (token, source, newValue) => {
  return new Promise((resolve, reject) => {
    getSessionFromToken(token)
      .then(session => database.updateContactRequest(session, source, newValue))
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
async function putSpotifyUserInfo(token, url, body) {
  const options = {
    url: 'https://api.spotify.com' + url,
    headers: { Authorization: 'Bearer ' + token },
    json: true,
    body: body
  }
  requestLib.put(options, function(error, response, body) {
    if (error) {
      console.log(response.statusCode, error)
      return error
    } else {
      console.log('no error', response.statusCode, body)
      return body
    }
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
          console.log('requestSpotifyUserInfo resolve no content (204)')
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
  retractContact,
  getCurrentSong,
  startPlayback
}
