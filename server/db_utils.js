const Contact = require('./Models/Contact')
const User = require('./Models/User')

const getContacts = async session => {
  try {
    let contactsMapped = []
    const contacts = await findContacts(session.userID)
    for (const contact of contacts) {
      contactMapped = await contactMapUserInfo(contact, session.userID)
      contactsMapped = [...contactsMapped, contactMapped]
    }
    return contactsMapped
  } catch (err) {
    console.log('getContacts', err)
    return null
  }
}
async function contactMapUserInfo(contact, userID) {
  try {
    // contact points to two users, map user who is not sending the request
    const idToMap = contact.source === userID ? contact.target : contact.source
    const userToMap = await User.findOne({ id: idToMap }).exec()
    if (userToMap) {
      return {
        ...contact._doc,
        id: userToMap.id,
        display_name: userToMap.display_name
      }
    } else {
      return contact
    }
  } catch (err) {
    console.log('contactMapUserInfo', err)
    return null
  }
}

function findContacts(userID) {
  return new Promise((resolve, reject) => {
    Contact.find(
      {
        status: 20,
        $or: [{ source: userID }, { target: userID }]
      },
      function(err, contacts) {
        if (err) {
          reject(err)
        } else {
          resolve(contacts)
        }
      }
    )
  })
}

module.exports = { getContacts }
