const User = require('./Models/User')
const UserSession = require('./Models/UserSession')

const getOrCreateUser = body => {
  return new Promise((resolve, reject) => {
    getUser(body.id)
      .then(user => resolve(user))
      .catch(error => {
        createUser(body)
          .then(user => resolve(user))
          .catch(error => reject(error))
      })
  })
}

const getUser = id => {
  return new Promise((resolve, reject) => {
    User.findOne({ id })
      .then(user => (user === null ? reject('no user found') : resolve(user)))
      .catch(error => reject(error))
  })
}
const createUser = body => {
  return new Promise((resolve, reject) => {
    const NewUser = new User()
    NewUser.email = body.email
    NewUser.href = body.href
    NewUser.product = body.product
    NewUser.id = body.id
    NewUser.display_name = body.display_name
    NewUser.save()
      .then(user => resolve(user))
      .catch(error => reject(error))
  })
}
const createUserSession = (user, access_token, refresh_token, expires_in) => {
  return new Promise((resolve, reject) => {
    const NewUserSession = new UserSession()
    NewUserSession.userID = user.id
    NewUserSession.spotify_access_token = access_token
    NewUserSession.spotify_refresh_token = refresh_token
    NewUserSession.expires_in = expires_in
    NewUserSession.save()
      .then(session => resolve(session._id.toString()))
      .catch(error => reject(error))
  })
}

const getUserSession = token => {
  return new Promise((resolve, reject) => {
    if (token) {
      UserSession.findById(token)
        .then(session => resolve(session))
        .catch(error => reject(error))
    } else {
      reject('GetUserSession: no token')
    }
  })
}
const updateUserSession = (session, newValues) => {
  console.log('updateUserSession', newValues)
  return new Promise((resolve, reject) => {
    console.log(session, newValues)
    UserSession.findByIdAndUpdate(session._id, newValues)
      .then(session => resolve(session))
      .catch(error => reject(error))
  })
}

module.exports = {
  getOrCreateUser,
  createUserSession,
  getUserSession,
  updateUserSession
}
