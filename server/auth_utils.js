const sanitize = require('mongo-sanitize')
const UserSession = require('./Models/UserSession')
const User = require('./Models/User')
const { client_secret, client_id } = require('./config/config')
const { getSpotifyRequest, postSpotifyRequest } = require('./request_utils')

const deleteUserSessions = async (session, deleteAllSessions = false) => {
  try {
    let query = {}
    deleteAllSessions
      ? (query.userID = session.userID)
      : (query._id = session.id)
    return await UserSession.deleteMany({
      ...query
    }).exec()
  } catch (err) {
    console.log('deleteUserSessions', err)
    return null
  }
}
const getSessionIfValid = async (token, checkSpotifyToken = false) => {
  try {
    if (token) {
      const session = await UserSession.findOne({ _id: sanitize(token) })
      if (session) {
        if (!checkSpotifyToken) {
          return session
        } else {
          validSession = await verifySpotifyToken(session)
          return validSession != null ? validSession : null
        }
      }
    }
    return null
  } catch (err) {
    console.log('getSessionIfValid', err)
    return null
  }
}
const handleUserLogin = async (access_token, refresh_token) => {
  try {
    const body = await getSpotifyRequest(access_token)
    if (body && body.id) {
      let user = await User.findOne({ id: sanitize(body.id) }).exec()
      if (!user) {
        user = new User()
        user.id = body.id
        user.href = body.href
        user.display_name = body.display_name
      }
      if (user) {
        // update product on user login (premium / free account)
        user.product = body.product
        user.images = body.images
        user = await user.save()

        session = new UserSession()
        session.userID = user.id
        session.spotify_access_token = access_token
        session.spotify_refresh_token = refresh_token
        session = await session.save()
        return session._id
      }
    }
    return null
  } catch (err) {
    console.log('handleUserLogin err:', err)
    return null
  }
}
const verifySpotifyToken = async session => {
  try {
    const body = await getSpotifyRequest(session.spotify_access_token)
    if (body && body.id === session.userID) {
      return session
    } else {
      updatedSession = await refreshSpotifyToken(session)

      return updatedSession != null ? updatedSession : null
    }
  } catch (err) {
    console.log('verifySpotifyToken err:', err)
    return null
  }
}
async function getValidSessionForUser(userID, tryRefresh = false) {
  try {
    sessions = await UserSession.find({ userID }).exec()
    sessions.sort((a, b) => b.timestamp - a.timestamp)
    for (const session of sessions) {
      const validSession = await verifySpotifyToken(session, tryRefresh)
      return validSession != null ? validSession : null
    }
  } catch {
    console.log('getValidSessionForUser err:', err)
    return null
  }
}
const refreshSpotifyToken = async session => {
  try {
    const form = {
      refresh_token: session.spotify_refresh_token,
      grant_type: 'refresh_token'
    }
    const headers = {
      Authorization:
        'Basic ' +
        Buffer.from(client_id + ':' + client_secret).toString('base64')
    }
    const body = await postSpotifyRequest('/api/token', form, headers)
    if (body && body.access_token) {
      session.spotify_access_token = body.access_token
      const updatedSession = await session.save()
      console.log('refreshed token', session.userID)
      return updatedSession != null ? updatedSession : null
    }
    return null
  } catch (err) {
    console.log('refreshSpotifyToken err:', err)
    return null
  }
}

module.exports = {
  getSessionIfValid,
  handleUserLogin,
  getValidSessionForUser,
  deleteUserSessions
}
