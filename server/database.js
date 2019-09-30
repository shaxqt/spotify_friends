const User = require('./Models/User')
const UserSession = require('./Models/UserSession')
const Contact = require('./Models/Contact')

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
        console.log('getUser error (userID ' + id + ')', err)
        reject(err)
      } else {
        console.log(
          'getUser for id (' + id + ') found: ' + (user == null)
            ? 'null'
            : user.id
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
    session.spotify_expires_at = Date.now() + Number(expires_in * 1000)
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
    console.log(
      'updateUserSession for session ' + session._id + ' new Values ',
      newValues
    )
    UserSession.findOneAndUpdate(
      { _id: session._id },
      newValues,
      { new: true },
      function(err, newSession) {
        if (err) {
          console.log('updateUserSession error updating UserSession')
          reject(err)
        } else {
          if (newSession == null) {
            console.log('updateUserSession reject, no updated Session')
            reject('got no updated UserSession')
          } else {
            console.log('updateUserSession resolve updated')
            resolve(newSession)
          }
        }
      }
    )
  })
}

const getContactRequests = session => {
  return new Promise((resolve, reject) => {
    const filter = { target: session.userID, status: 0 }
    Contact.find(filter, function(err, contacts) {
      if (err) {
        reject(err)
      } else {
        console.log('database getContactRequests', contacts)
        contactsMapDisplayName(contacts)
          .then(mappedContacts => resolve(mappedContacts))
          .catch(err => reject(err))
      }
    })
  })
}
const createContact = (session, target, message) => {
  return new Promise((resolve, reject) => {
    const contact = new Contact()
    contact.source = session.userID
    contact.target = target
    contact.message = message
    contact.save(function(err, newContact) {
      if (err) {
        console.log('createContact', err)
        reject(err)
      } else {
        newContact == null ? reject('no contact') : resolve(newContact)
        console.log('createContact', newContact)
      }
    })
  })
}
function contactsMapDisplayName(contacts) {
  return new Promise((resolve, reject) => {
    // TODO map läuft nach dem resolve erst durch.
    // neue contacte haben key display_name nicht
    mappedContacts = contacts.map(contact => {
      return getUser(contact.source)
        .then(user => ({
          message: contact.message,
          display_name: user.display_name
        }))
        .catch(err => reject(err))
    })
    Promise.all(mappedContacts)
      .then(array => resolve(array))
      .catch(err => reject(err))
  })
}
module.exports = {
  getOrCreateUser,
  createUserSession,
  getUserSession,
  updateUserSession,
  createContact,
  getContactRequests
}
