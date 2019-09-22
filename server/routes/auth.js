const router = require('express').Router()
const querystring = require('querystring')
const requestLib = require('request')

const CONFIG = require('../config/config')
const { client_secret, client_id, tokenCookieName, host, frontend } = CONFIG
const redirect_uri = host + '/auth/callback'

const spotifyApi = require('../spotifyApi')

if (!(client_secret && client_id)) {
  console.log('Warning: check config.js')
}

/*
 * checks if token is valid
 * token should be given in body as token
 * optional set tryHard to true, so function trys to use
 * spotify token to get information from spotify api
 */
router.post('/verify', function(req, res) {
  const token = req.body ? req.body.token : null
  const tryHard = req.body ? req.body.tryHard : false
  if (token) {
    spotifyApi
      .isUserSessionValid(token, tryHard)
      .then(isValid => res.send({ success: isValid, token: token }))
      .catch(error => res.send({ isValid: false, token: '', error: error }))
  } else {
    res.send({ success: false, token: '' })
  }
})

/*
 *  this function redirects the user to https://accounts.spotify.com/authorize?
 * after loggin in and commiting access to his account, he gets redirected back to
 * redirect_uri ('/callback)
 */
const stateKey = 'spotify_auth_state'
router.get('/login', function(req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = `user-read-private user-read-email user-read-currently-playing user-read-playback-state user-top-read`
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

/*
 * handles the callback from spotify,
 * extracting the code (from url) to get an access token with another request
 * gets or create a user and creates a UserSession
 * sets cookie (id to UserSession) to remeber user
 */
router.get('/callback', function(req, res) {
  const { code, state, error } = req.query
  const storedState = req.cookies ? req.cookies[stateKey] : null
  const token = req.cookies ? req.cookies[tokenCookieName] : null

  // check if user is still logged in, bevor create new UserSession
  spotifyApi
    .isUserSessionValid(token, true)
    .then(isValid => res.redirect(frontend))
    .catch(meansInvalid => {
      if (error || state === '' || state === null || state !== storedState) {
        console.log(
          'state mismatch',
          'state: ' + state,
          'storedState ' + storedState,
          'error' + error,
          'cookies ',
          req.cookies
        )
        res.redirect(frontend)
      } else {
        res.clearCookie(stateKey)
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code,
            client_id,
            client_secret,
            redirect_uri,
            grant_type: 'authorization_code'
          },
          json: true
        }

        requestLib.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {
            const { access_token, refresh_token, expires_in } = body

            spotifyApi
              .handleUserLogin(access_token, refresh_token, expires_in)
              .then(token => res.cookie(tokenCookieName, token))
              .catch(error => console.log(error))
              .finally(() => res.redirect(frontend))
          } else {
            res.redirect(frontend)
          }
        })
      }
    })
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
