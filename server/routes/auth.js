const router = require('express').Router()
const querystring = require('querystring')
const { getSessionIfValid, handleUserLogin } = require('../auth_utils')
const { postSpotifyRequest } = require('../request_utils')

let config = null
try {
  config = require('../config/config')
} catch (err) {
  console.log('AUTH no config file')
}

const client_secret = config
  ? process.env.CLIENT_SECRET || config['client_secret']
  : process.env.CLIENT_SECRET
const client_id = config
  ? process.env.CLIENT_ID || config['client_id']
  : process.env.CLIENT_ID
const redirect_uri = config
  ? process.env.REDIRECT_URI || config['redirect_uri']
  : process.env.REDIRECT_URI

const stateKey = 'spotify_auth_state'
router.get('/yolo', function(req, res) {
  console.log('JA MOIN')
})
router.get('/login', function(req, res) {
  console.log('TEEEST')
  console.log('AUTH/LOGIN CALLED', client_id, client_secret, redirect_uri)
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  if (client_id && redirect_uri && client_secret) {
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
  } else {
    res.send('<h1>Sorry</h1><p>Something went wrong</p>')
  }
})

router.get('/callback', async function(req, res) {
  try {
    const { code, state, error, token } = req.query
    const storedState = req.cookies ? req.cookies[stateKey] : null
    console.log('CALLBACK CALLED', code, state, error, token)
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
