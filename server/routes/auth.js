const router = require('express').Router()
const querystring = require('querystring')
const requestLib = require('request')

const { client_secret, client_id } = require('../config/config')

const {
  getSessionFromToken,
  isUserSessionValid,
  handleUserLogin
} = require('../spotifyApi')

let redirect_uri = ''
/*
 *  this function redirects the user to https://accounts.spotify.com/authorize?
 * after loggin in and commiting access to his account, he gets redirected back to
 * redirect_uri
 */
const stateKey = 'spotify_auth_state'
router.get('/login', function(req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  redirect_uri = req.protocol + '://' + req.hostname + ':3000'

  // application requests authorization
  const scope = `app-remote-control streaming user-read-private user-read-email user-read-currently-playing user-read-playback-state user-top-read`
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

router.get('/callback', function(req, res) {
  const { code, state, error, token } = req.query
  const storedState = req.cookies ? req.cookies[stateKey] : null

  console.log('/CALLBACK ', redirect_uri)
  if (code == null && state == null && storedState == null && token == null) {
    // if all parameters to check are empty
    console.log('/callback Bad Request query:', req.query)
    res.send({ success: false, token: '', error: 'Bad Request' })
  } else {
    // check if user is still logged in, before create new UserSession
    let sessionIsValid = false
    getSessionFromToken(token)
      .then(session => isUserSessionValid(session))
      .then(isValid => (sessionIsValid = isValid))
      .catch(err => console.log('/callback error verifying token', err))
      .finally(() => {
        if (sessionIsValid) {
          console.log('/callback UserSession is valid')
          res.send({ success: true, token: token })
        } else {
          console.log('/callback UserSession is invalid')
          // check if callback params match given params to spotify
          if (
            error ||
            code === '' ||
            code == null ||
            state === '' ||
            state == null ||
            state !== storedState
          ) {
            console.log(
              'state mismatch',
              'state: ' + state,
              'storedState ' + storedState,
              'error ' + error
            )
            res.clearCookie(stateKey)
            res.send({ success: false, token: '', error: 'state missmatch' })
          } else {
            console.log('/callback requesting new spotify token...')
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

                // get or create User, create UserSession
                handleUserLogin(access_token, refresh_token, expires_in)
                  .then(token => res.send({ success: true, token: token }))
                  .catch(err =>
                    res.send({
                      success: false,
                      token: '',
                      error: 'error in function handleUserlogin'
                    })
                  )
              } else {
                res.send({
                  success: false,
                  token: '',
                  error: 'error from spotify token request'
                })
              }
            })
          }
        }
      })
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
