/*
 * Looks for query parameter in current location.
 * This will happen if user was redirected from spotifys login page to this location.
 * Checks also for a token in local storage
 * sends query parameter and/or token to /auth/callback and true or false
 */
const getOrVerifyToken = () => {
  return new Promise((resolve, reject) => {
    const currToken = localStorage.getItem('spotify_friends_token')

    const tokenSeperator = window.location.search ? '&token=' : '?token='
    const query = window.location.search + tokenSeperator + currToken

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
      .finally(() => console.log('finally'))
  })
}
export { getOrVerifyToken }
