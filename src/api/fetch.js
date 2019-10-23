const postRequest = (url, body) => {
  return request('POST', body, url)
}
const putRequest = (url, body) => {
  return request('PUT', body, url)
}
const deleteRequest = (url, body) => {
  return request('DELETE', body, url)
}

function request(method = 'GET', body, url) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('spotify_friends_token')
    if (!token) {
      return reject('no token')
    }
    body = {
      ...body,
      spotify_friends_token: token
    }
    fetch(url, {
      method: method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .catch(err => reject(err))

      .then(json => resolve(json))
      .catch(err => reject(err))
  })
}
export { postRequest, putRequest, deleteRequest }
