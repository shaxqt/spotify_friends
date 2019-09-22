const verifyToken = token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject('no token')
    }
    fetch('http://localhost:3333/auth/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: token })
    })
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  })
}

export { verifyToken }
