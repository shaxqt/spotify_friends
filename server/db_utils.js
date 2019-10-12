const Contact = require('./Models/Contact')
const User = require('./Models/User')
const sanitize = require('mongo-sanitize')

const getContacts = async session => {
  try {
    const contacts = await findContacts(session.userID)
    return await contactsMapUserInfo(contacts, session.userID)
  } catch (err) {
    console.log('getContacts', err)
    return null
  }
}
const getRequests = async session => {
  try {
    const contacts = await findRequests(session.userID)
    return await contactsMapUserInfo(contacts, session.userID)
  } catch (err) {
    console.log('getContacts', err)
    return null
  }
}

const getMe = async session => {
  const user = await User.findOne({ id: session.userID }).exec()
  if (user) {
    return {
      id: user.id,
      display_name: user.display_name,
      email: user.email,
      images: user.images
    }
  }
  return null
}
const searchUsersByDisplayName = async (session, query) => {
  try {
    let mappedUsers = []
    if (query.length > 0) {
      const users = await findUsersByDisplayName(session, query)
      for (const user of users) {
        mappedUsers = [
          ...mappedUsers,
          await userMapContactInfo(user, session.userID)
        ]
      }
    }
    return mappedUsers
  } catch (error) {
    console.log('getUsers', err)
    return null
  }
}
const deleteContact = (session, target) => {
  return new Promise((resolve, reject) => {
    Contact.findOneAndDelete(
      {
        source: session.userID,
        target: target
      },
      function(err, contact) {
        err ? resolve(false) : resolve(true)
      }
    )
  })
}
const createContact = async (session, target) => {
  try {
    const contact = new Contact()
    contact.source = session.userID
    contact.target = target
    const newContact = await contact.save()
    return newContact != null ? newContact : null
  } catch (err) {
    console.log('createContact', err)
    return null
  }
}
const acceptOrDenyContact = (session, source, accept) => {
  return new Promise((resolve, reject) => {
    const status = accept ? 20 : 10
    Contact.findOneAndUpdate(
      { source: source, target: session.userID },
      { status },
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
const userUpdateDisplayName = async (session, display_name) => {
  display_name = sanitize(display_name)

  if (!display_name || display_name.length < 3) {
    throw 'display_name to short'
  }
  const user = await User.findOneAndUpdate(
    { id: session.userID },
    { display_name }
  ).exec()
  return user ? user : null
}

function getContactFromUsers(userID_1, userID_2) {
  return new Promise((resolve, reject) => {
    Contact.findOne(
      {
        $or: [
          { $and: [{ source: userID_1 }, { target: userID_2 }] },
          { $and: [{ source: userID_2 }, { target: userID_1 }] }
        ]
      },
      function(err, contact) {
        err ? reject(err) : resolve(contact)
      }
    )
  })
}
function findUsersByDisplayName(session, query) {
  return new Promise((resolve, reject) => {
    User.find(
      {
        id: { $ne: session.userID },
        display_name: new RegExp('.*' + sanitize(query) + '.*', 'i')
      },
      function(err, users) {
        if (err) {
          reject(err)
        } else {
          resolve(users)
        }
      }
    )
  })
}
function findContacts(userID) {
  return new Promise((resolve, reject) => {
    Contact.find(
      {
        status: 20,
        $or: [{ source: userID }, { target: userID }]
      },
      function(err, contacts) {
        err ? reject(err) : resolve(contacts)
      }
    )
  })
}
function findRequests(userID) {
  return new Promise((resolve, reject) => {
    Contact.find(
      {
        target: userID,
        status: 0
      },
      function(err, requests) {
        err ? reject(err) : resolve(requests)
      }
    )
  })
}
async function contactMapUserInfo(contact, userID) {
  try {
    // contact points to two users, map user who is not sending the request
    const idToMap = contact.source === userID ? contact.target : contact.source
    const userToMap = await User.findOne({ id: idToMap }).exec()
    if (userToMap) {
      return {
        ...contact._doc,
        images: userToMap.images,
        id: userToMap.id,
        display_name: userToMap.display_name
      }
    }
    return null
  } catch (err) {
    console.log('contactMapUserInfo', err)
    return null
  }
}
async function userMapContactInfo(user, userID) {
  try {
    const contact = await getContactFromUsers(user.id, userID)
    if (contact) {
      return {
        id: user.id,
        display_name: user.display_name,
        images: user.images,
        target: contact.target,
        source: contact.source,
        status: contact.status
      }
    }
    return {
      id: user.id,
      images: user.images,
      display_name: user.display_name
    }
  } catch (err) {
    console.log('contactMapUserInfo', err)
    return null
  }
}
async function contactsMapUserInfo(contacts, userID) {
  let contactsMapped = []
  for (const contact of contacts) {
    contactsMapped = [
      ...contactsMapped,
      await contactMapUserInfo(contact, userID)
    ]
  }
  return contactsMapped
}

module.exports = {
  getContacts,
  createContact,
  deleteContact,
  acceptOrDenyContact,
  searchUsersByDisplayName,
  getRequests,
  userUpdateDisplayName,
  getMe
}
