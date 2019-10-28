const { postRequest, deleteRequest } = require('./fetch')

export const getTopSongs = async (time_range = 'short_term') => {
  const res = await postRequest('/user/top', { type: 'tracks', time_range })
  return res.success ? res.items : null
}
export const getTopArtists = async (time_range = 'short_term') => {
  const res = await postRequest('/user/top', { type: 'artists', time_range })
  return res.success ? res.items : null
}
export const getCurrentUser = _ => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/get_me')
    res.success ? resolve(res.item) : reject(res)
  })
}
export const logout = allDevices => {
  return new Promise(async (resolve, reject) => {
    const res = await deleteRequest('/user/session', {
      deleteAllSessions: allDevices
    })
    return res.success ? resolve(res.deletedCount) : reject(res)
  })
}
export const updateUserSettings = ({ display_name, isUserImagePublic }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await postRequest('/user/update_settings', {
        display_name: display_name,
        isUserImagePublic: isUserImagePublic
      })
      res.success ? resolve(res) : reject(res)
    } catch (err) {
      reject(err)
    }
  })
}
export const searchUser = query => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/get_user', {
      query_string: query
    })
    if (res.success) {
      resolve(
        res.items.map(userFound => {
          const userInfo = getContactInfo(userFound)
          return {
            ...userFound,
            ...userInfo
          }
        })
      )
    } else {
      reject(res)
    }
  })
}
export const getDevices = _ => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await postRequest('/user/get_devices')
      res.success ? resolve(res.items) : reject(res)
    } catch (err) {
      reject(err)
    }
  })
}
export const createOrRetractContactRequest = (user, create = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = create ? '/user/create_contact' : '/user/retract_contact'
      const res = await postRequest(url, { target: user.id })
      res.success ? resolve(res) : reject(res)
    } catch (err) {
      reject(err)
    }
  })
}
export const getContactRequests = _ => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/get_requests')
    res.success ? resolve(res.items) : reject(res)
  })
}
export const acceptOrDenyContactRequest = (request, accept = true) => {
  return new Promise(async (resolve, reject) => {
    const url = accept ? '/user/accept_request' : '/user/deny_request'
    const body = { source: request.source }
    const res = await postRequest(url, body)
    res.success ? resolve(res.items) : reject(res)
  })
}
export const getFriends = _ => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/contacts')
    if (res.success) {
      const contacts = res.items
      contactsSortByTimestamp(contacts)
      resolve(contacts)
    } else {
      reject(res)
    }
  })
}
function contactsSortByTimestamp(contacts) {
  contacts.sort((a, b) => {
    if (a.currSong) {
      if (b.currSong) {
        return b.currSong.timestamp - a.currSong.timestamp
      } else {
        return -1
      }
    } else {
      return 1
    }
  })
}
function getContactInfo(user) {
  let contactInfo = '',
    isAddButtonActive = false,
    isRetractButtonActive = false,
    isAcceptButtonActive = false
  if (user && user.hasOwnProperty('status')) {
    if (user.status === 0) {
      if (user.target === user.id) {
        contactInfo = 'contact already requestet'
        isRetractButtonActive = true
        isAddButtonActive = false
      } else if (user.source === user.id) {
        contactInfo = 'you should have a contact request'
        isAddButtonActive = false
      } else {
        contactInfo = ''
        isAddButtonActive = true
      }
    } else if (user.status === 10) {
      if (user.target === user.id) {
        contactInfo = 'contact already requestet'
        isAddButtonActive = false
      } else if (user.source === user.id) {
        contactInfo = 'you denied the request'
        isAddButtonActive = false
        isAcceptButtonActive = true
      } else {
        contactInfo = ''
        isAddButtonActive = true
      }
    } else if (user.status === 20) {
      contactInfo = 'already in your contacts'
      isAddButtonActive = false
    }
  } else {
    contactInfo = ''
    isAddButtonActive = true
  }
  return {
    contactInfo,
    isAddButtonActive,
    isRetractButtonActive,
    isAcceptButtonActive,
    getTopSongs
  }
}
