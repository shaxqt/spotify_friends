const User = require('./Models/User')
const UserSession = require('./Models/UserSession')
const Contact = require('./Models/Contact')

const getAllUserSessions = userID => {
  return new Promise((resolve, reject) => {
    UserSession.find({ userID }, function(err, sessions) {
      if (err) {
        reject(err)
      } else {
        resolve(sessions)
      }
    })
  })
}
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
const getUsersByDisplayName = (search, session) => {
  return new Promise((resolve, reject) => {
    User.find(
      {
        id: { $ne: session.userID },
        display_name: new RegExp('.*' + search + '.*', 'i')
      },
      'display_name href id',
      function(err, users) {
        if (err) {
          reject(err)
        } else {
          if (users == null) {
            reject('no users found (' + search + ')')
          } else {
            //map contact-status to users
            userMapContactData(session, users)
              .then(userContact => resolve(userContact))
              .catch(err => reject(err))
          }
        }
      }
    )
  })
}
const getUser = id => {
  return new Promise((resolve, reject) => {
    console.log('getUser start for id ' + id)
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
const updateContactRequest = (session, source, newStatus) => {
  return new Promise((resolve, reject) => {
    Contact.findOne({ source: source, target: session.userID }, function(
      err,
      contact
    ) {
      if (err) {
        reject(err)
      } else if (contact == null) {
        reject(
          'no contact found (source:' +
            source +
            ', target: ' +
            session.userID +
            ')'
        )
      } else {
        // user doing this request has to be target of contact request
        if (session.userID === contact.target) {
          contact.status = newStatus
          contact.save(function(err, updatedContact) {
            if (err) {
              reject(err)
            } else if (updatedContact == null) {
              reject('no updated contact')
            } else {
              resolve(updatedContact)
            }
          })
        } else {
          reject(
            'session is not target. session.userID: ' +
              session.userID +
              ' contact.target: ' +
              contact.target +
              ' contact.source:' +
              contact.source
          )
        }
      }
    })
  })
}
const getContacts = session => {
  return new Promise((resolve, reject) => {
    console.log('database getContacts called')
    Contact.find(
      {
        status: 20,
        $or: [{ source: session.userID }, { target: session.userID }]
      },
      function(err, contacts) {
        if (err) {
          console.log('database getContacts reject mongo error')
          reject(err)
        } else {
          console.log('database getContacts contacts', contacts)
          contactsMapDisplayName(contacts, session)
            .then(mappedContacts => resolve(mappedContacts))
            .catch(err => reject(err))
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
        contactsMapDisplayName(contacts, session)
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
const removeContact = (session, target) => {
  return new Promise((resolve, reject) => {
    Contact.findOneAndRemove(
      { source: session.userID, target: target },
      function(err, contact) {
        if (err) {
          reject(err)
        } else {
          resolve(contact)
        }
      }
    )
  })
}
function userGetContact(user, session) {
  return new Promise((resolve, reject) => {
    Contact.findOne(
      {
        $or: [{ source: session.userID }, { target: session.userID }],
        $or: [{ source: user.id }, { target: user.id }]
      },
      function(err, contact) {
        if (err) {
          reject(err)
        } else {
          resolve(contact)
        }
      }
    )
  })
}
function userMapContactData(session, users) {
  return new Promise((resolve, reject) => {
    console.log('userMapContactData users:', users)
    // TODO map läuft nach dem resolve erst durch.
    // neue contacte haben key display_name nicht
    mappedContacts = users.map(user => {
      return userGetContact(user, session)
        .then(contact => {
          if (contact) {
            const mapped = {
              id: user.id,
              display_name: user.display_name,
              target: contact.target,
              source: contact.source,
              status: contact.status
            }
            console.log('mapped Object', mapped)
            return mapped
          } else {
            return user
          }
        })
        .catch(err => reject(err))
    })
    Promise.all(mappedContacts)
      .then(array => {
        console.log('userMapContactData mapped:', array)
        resolve(array)
      })
      .catch(err => reject(err))
  })
}
const updateCurrSong = async (id, currSong) => {
  const savedUser = await User.findOneAndUpdate({ id }, { currSong })
  return savedUser.currSong
}
const getCurrSong = async id => {
  const user = await User.findOne({ id })
  return user.currSong
}
function contactsMapDisplayName(contacts, session) {
  return new Promise((resolve, reject) => {
    // TODO map läuft nach dem resolve erst durch.
    // neue contacte haben key display_name nicht
    console.log('contactsMapDisplayName contacts:', contacts)
    mappedContacts = contacts.map(contact => {
      // always map name of that user who was not sending the request
      const userNameToMap =
        session.userID === contact.source ? contact.target : contact.source
      return getUser(userNameToMap)
        .then(user => {
          if (user == null) {
            reject('no user found for contact.source: ' + userNameToMap)
          } else {
            return {
              _id: contact._id,
              id: user.id,
              message: contact.message,
              display_name: user.display_name,
              target: contact.target,
              source: contact.source,
              status: contact.status
            }
          }
        })
        .catch(err => reject(err))
    })
    Promise.all(mappedContacts)
      .then(array => {
        console.log('contactsMapDisplayName resolve:', array)
        resolve(array)
      })
      .catch(err => reject(err))
  })
}
module.exports = {
  getOrCreateUser,
  createUserSession,
  getUserSession,
  updateUserSession,
  createContact,
  getContactRequests,
  updateContactRequest,
  getUsersByDisplayName,
  removeContact,
  getContacts,
  getAllUserSessions,
  updateCurrSong,
  getCurrSong
}
