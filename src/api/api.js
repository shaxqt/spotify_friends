const { postRequest } = require('./fetch')

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
      if (res.succes) {
        resolve(res)
      } else {
        reject(res)
      }
    } catch (err) {
      reject(err)
    }
  })
}
export const acceptOrDenyContactRequest = (request, accept = true) => {
  return new Promise(async (resolve, reject) => {
    const url = accept ? '/user/accept_request' : '/user/deny_request'
    const body = { source: request.source }
    const res = await postRequest(url, body)
    if (res.succes) {
      resolve(res)
    } else {
      reject(res)
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
