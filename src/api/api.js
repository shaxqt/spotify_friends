import { postRequest } from './fetch'

const getContacts = token => {
  return new Promise((resolve, reject) => {
    postRequest(token, 'http://localhost:3333/user/contacts')
      .then(json => resolve(JSON.stringify(json)))
      .catch(err => reject(err))
  })
}

export { getContacts }
