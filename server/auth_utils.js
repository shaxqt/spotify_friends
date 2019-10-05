const sanitize = require('mongo-sanitize')
const UserSession = require('./Models/UserSession')
const User = require('./Models/User')
const { client_secret, client_id } = require('./config/config')
const { postRequest, getRequest } = require('./request_utils')

const getSessionIfValid = async (token, checkSpotifyToken = false) => {
  try {
    const session = await UserSession.findOne({ _id: sanitize(token) })
    if (session) {
      if (!checkSpotifyToken) {
        return session
      } else {
        validSession = await verifySpotifyToken(session)
        return validSession != null ? validSession : null
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
    body = await requestSpotifyUserInfo(access_token)
    if (body && body.id) {
      let user = await User.findOne({ id: sanitize(body.id) }).exec()
      if (!user) {
        user = new User()
        user.email = body.email
        user.href = body.href
        user.id = body.id
      }
      if (user) {
        user.product = body.product
        user.display_name = body.display_name
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
    console.log('handleUserLogin', err)
    return null
  }
}
const verifySpotifyToken = async session => {
  try {
    const body = await requestSpotifyUserInfo(session.spotify_access_token)
    if (body && body.id === session.userID) {
      return session
    } else {
      console.log('verifySpotifyToken requesting new token')
      updatedSession = await refreshSpotifyToken(session)
      console.log('verifySpotifyToken got new token ' + updatedSession != null)

      return updatedSession != null ? updatedSession : null
    }
  } catch (err) {
    console.log('verifySpotifyToken', err)
    return null
  }
}

const requestSpotifyUserInfo = async token => {
  try {
    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + token },
      json: true
    }
    const body = await getRequest(options)
    return body != null ? body : null
  } catch (err) {
    console.log('requestSpotifyUserInfo', err)
    return null
  }
}
const refreshSpotifyToken = async session => {
  try {
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
    const body = await postRequest(authOptions)
    if (body && body.access_token) {
      session.spotify_access_token = body.access_token
      const updatedSession = await session.save()
      return updatedSession != null ? updatedSession : null
    }
    return null
  } catch (err) {
    console.log('refreshSpotifyToken', err)
    return null
  }
}

module.exports = { getSessionIfValid, handleUserLogin }
