const { postRequest } = require('./fetch')

export const getCurrentUser = _ => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/get_me')
    res.success ? resolve(res.item) : reject(res)
  })
}
export const updateDisplayName = display_name => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/update_display_name', { display_name })
    res.success ? resolve(res.display_name) : reject(res)
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
          const {
            contactInfo,
            isAddButtonActive,
            isRetractButtonActive
          } = getContactInfo(userFound)
          return {
            ...userFound,
            contactInfo,
            isAddButtonActive,
            isRetractButtonActive
          }
        })
      )
    } else {
      reject(res)
    }
  })
}
export const createOrRetractContactRequest = (user, create = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = create ? '/user/create_contact' : '/user/retract_contact'
      const res = await postRequest(url, { target: user.id })
      if (res.success) {
        resolve(res)
      } else {
        reject(res)
      }
    } catch (err) {
      reject(err)
    }
  })
}
export const getContactRequests = _ => {
  return new Promise(async (resolve, reject) => {
    const res = await postRequest('/user/get_requests')
    if (res.success) {
      resolve(res.items)
    } else {
      reject(res)
    }
  })
}
export const acceptOrDenyContactRequest = (request, accept = true) => {
  return new Promise(async (resolve, reject) => {
    const url = accept ? '/user/accept_request' : '/user/deny_request'
    const body = { source: request.source }
    const res = await postRequest(url, body)
    if (res.success) {
      resolve(res)
    } else {
      reject(res)
    }
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
        return a.currSong.timestamp - b.currSong.timestamp
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
    isRetractButtonActive = false
  if (user.status != null && user.status === 0) {
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
  } else if (user.status && user.status === 10) {
    if (user.target === user.id) {
      contactInfo = 'contact already requestet'
      isAddButtonActive = false
    } else if (user.source === user.id) {
      contactInfo = 'you denied the request'
      isAddButtonActive = false
    } else {
      contactInfo = ''
      isAddButtonActive = true
    }
  } else if (user.status != null && user.status === 20) {
    contactInfo = 'already in your contacts'
    isAddButtonActive = false
  } else {
    contactInfo = ''
    isAddButtonActive = true
  }
  return { contactInfo, isAddButtonActive, isRetractButtonActive }
}
