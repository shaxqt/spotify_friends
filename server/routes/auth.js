const router = require('express').Router()
const querystring = require('querystring')
const requestLib = require('request')

const CONFIG = require('../config/config')
const { client_secret, client_id, tokenCookieName, host, frontend } = CONFIG
const redirect_uri = host + '/auth/callback'

const spotifyApi = require('../spotifyApi')

/*
 *  this function redirects the user to https://accounts.spotify.com/authorize?
 * after loggin in and commiting access to his account, he gets redirected back to
 * redirect_uri ('/callback)
 */
const stateKey = 'spotify_auth_state'
router.get('/login', function(req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // application requests authorization
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
 * extracting the code (from url) to get an access token with another request.
 * gets or create a user and creates a UserSession
 * sets cookie (id to UserSession) to remeber user
 */
router.get('/callback', function(req, res) {
  const { code, state, error } = req.query
  const storedState = req.cookies ? req.cookies[stateKey] : null
  const token = req.cookies ? req.cookies[tokenCookieName] : null

  // check if user is still logged in, before create new UserSession
  spotifyApi
    .isUserSessionValid(token, true)
    .then(isValid => {
      console.log('isValid', isValid)
      if (isValid) {
        console.log('/callback UserSession still valid, no new Session created')
        res.redirect(frontend)
      } else {
        console.log(
          '/callback requesting new spotify token, own token invalid:',
          token
        )
        // check if callback params match given params to spotify
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
          // request a token from sporify with given code, client_id and client_secret
          res.clearCookie(stateKey)
          const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code,
              client_id,
              client_secret,
              // doesn't get used to redirect, but is needed to verify
              redirect_uri,
              grant_type: 'authorization_code'
            },
            json: true
          }
          requestLib.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              const { access_token, refresh_token, expires_in } = body
              /*
               * get or create a User, create a UserSession
               * somehow get token to client and redirect to frontend
               */
              spotifyApi
                .handleUserLogin(access_token, refresh_token, expires_in)
                .then(token => {
                  res.cookie(tokenCookieName, token, {
                    maxAge: 3600 * 60 * 24 * 30
                  })
                  res.redirect(frontend)
                })
                .catch(err => {
                  res.redirect(frontend)
                  console.log('/callback error handleUserLogin', err)
                })
            }
          })
        }
      }
    })
    .catch(err => {
      res.redirect(frontend)
      console.log('/callback error', err)
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
