const User = require('./Models/User')
const UserSession = require('./Models/UserSession')

const getOrCreateUser = body => {
  return new Promise((resolve, reject) => {
    getUser(body.id)
      .then(user => resolve(user))
      .catch(err => {
        createUser(body)
          .then(user => resolve(user))
          .catch(err => reject(err))
      })
  })
}
const getUser = id => {
  return new Promise((resolve, reject) => {
    User.findOne({ id: id }, function(err, user) {
      if (err) {
        console.log('getUser error (id ' + id + ')', err)
        reject(err)
      } else {
        console.log(
          'getUser for id (' + id + ') found: ' + (user == null)
            ? 'null'
            : user.jd
        )
        user == null ? reject('no user') : resolve(user)
      }
    })
  })
}
const createUser = body => {
  return new Promise((resolve, reject) => {
    const newUser = new User()
    newUser.email = body.email
    newUser.href = body.href
    newUser.product = body.product
    newUser.id = body.id
    newUser.display_name = body.display_name
    newUser.save(function(err, user) {
      if (err) {
        reject(err)
      } else {
        user == null ? reject('no user') : resolve(user)
      }
    })
  })
}
const createUserSession = (user, access_token, refresh_token, expires_in) => {
  return new Promise((resolve, reject) => {
    const session = new UserSession()
    session.userID = user.id
    session.spotify_access_token = access_token
    session.spotify_refresh_token = refresh_token
    session.expires_in = expires_in
    session.save(function(err, newSession) {
      if (err) {
        reject(err)
      } else {
        newSession == null ? reject('no user') : resolve(newSession)
      }
    })
  })
}
const getUserSession = token => {
  return new Promise((resolve, reject) => {
    UserSession.findOne({ _id: token }, function(err, session) {
      if (err) {
        console.log('getUserSession found NO session')
        reject(err)
      } else {
        if (session == null) {
          console.log('getUserSession no error but session is null')
          reject('no user')
        } else {
          console.log('getUserSession found session, resolve')
          resolve(session)
        }
      }
    })
  })
}
const updateUserSession = (session, newValues) => {
  return new Promise((resolve, reject) => {
    UserSession.findOneAndUpdate(
      { id: session._id },
      newValues,
      { new: true },
      function(err, newSession) {
        if (err) {
          console.log('updateUserSession error updating UserSession')
          reject(err)
        } else {
          console.log('updateUserSession updated UserSession')
          newSession == null ? reject('no user') : resolve(newSession)
        }
      }
    )
  })
}

module.exports = {
  getOrCreateUser,
  createUserSession,
  getUserSession,
  updateUserSession
}
