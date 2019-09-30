const postRequest = (token, url) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject('no token')
    }
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ spotify_friends_token: token })
    })
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  })
}

export { postRequest }
