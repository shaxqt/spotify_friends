const router = require('express').Router()
const querystring = require('querystring')
const { getSessionIfValid, handleUserLogin } = require('../auth_utils')
const { client_secret, client_id } = require('../config/config')
const { postSpotifyRequest } = require('../request_utils')

let redirect_uri = ''

const stateKey = 'spotify_auth_state'
router.get('/login', function(req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  //redirect_uri = req.protocol + '://' + req.hostname + ':3000'
  redirect_uri = 'http://localhost:3000'

  // application requests authorization
  const scope = `streaming user-read-private user-read-email user-read-currently-playing user-read-playback-state user-top-read`
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state
      })
  )
})

router.get('/callback', async function(req, res) {
  console.log('/callback')
  try {
    const { code, state, error, token } = req.query
    const storedState = req.cookies ? req.cookies[stateKey] : null
    console.log('/callback code:' + code + ' token: ' + token)

    if (token) {
      // check if session is valid
      session = await getSessionIfValid(token, true)
      session != null
        ? res.send({ success: true, token })
        : res.send({ success: false, error: 'invalid session' })
    } else if (code != null && state != null) {
      // code and state coming from spotify
      if (error || state !== storedState) {
        console.log(`state missmatch
          state: {state},
          storedState: {storedState},
          error: {error}`)
        res.clearCookie(stateKey)
        res.send({ success: false, error: 'state missmatch' })
      } else {
        // get new token from spotify
        res.clearCookie(stateKey)

        body = await postSpotifyRequest('/api/token', {
          code,
          client_id,
          client_secret,
          redirect_uri,
          grant_type: 'authorization_code'
        })
        if (body) {
          const { access_token, refresh_token } = body
          // get or create a user and cerate a session
          const token = await handleUserLogin(access_token, refresh_token)
          console.log(token)
          token != null
            ? res.send({ success: true, token })
            : res.send({ success: false, error: 'failed to login' })
        }
      }
    } else {
      res.send({ success: false, error: 'bad request' })
    }
  } catch (error) {
    res.send({ success: false, error })
  }
})

function generateRandomString(length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

module.exports = router
