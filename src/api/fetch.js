const postRequest = (body, url) => {
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
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  })
}

export { postRequest }
