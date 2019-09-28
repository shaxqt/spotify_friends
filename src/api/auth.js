/*
 * Looks for query parameter in current location.
 * This will happen if user was redirected from spotifys login page to this location.
 * Checks also for a token in local storage
 * sends query parameter and/or token to /auth/callback and true or false
 */
const getOrVerifyToken = () => {
  return new Promise((resolve, reject) => {
    if (window.location.search) {
      // if user was redirected from spotify, store query and redirect to home
      localStorage.setItem('spotify_redirect_query', window.location.search)
      window.location = window.location.origin
    } else {
      const spotify_query = localStorage.getItem('spotify_redirect_query')

      if (spotify_query) {
        // if spotify query is in local storage -> send to backend to get token
        localStorage.removeItem('spotify_redirect_query')
        fetchAuth(spotify_query)
          .then(success => resolve(success))
          .catch(err => reject(err))
      } else {
        const token = localStorage.getItem('spotify_friends_token')
        if (token) {
          // send token to backend to verify
          fetchAuth('?token=' + token)
            .then(success => resolve(success))
            .catch(err => reject(err))
        } else {
          // nothing in local storage -> nothing to verify
          console.log('nothing to check in local storage')
          resolve(false)
        }
      }
    }
  })
}

function fetchAuth(query) {
  return new Promise((resolve, reject) => {
    fetch('/auth/callback' + query)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          localStorage.setItem('spotify_friends_token', json.token)
          resolve(true)
          console.log('fetch /auth/callback resolve: true')
        } else {
          resolve(false)
          console.log('fetch /auth/callback resolve: false')
        }
      })
      .catch(err => reject(err))
  })
}

export { getOrVerifyToken }
