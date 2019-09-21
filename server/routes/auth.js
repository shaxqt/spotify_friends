const router = require('express').Router()
const querystring = require('querystring')
const requestLib = require('request')

const CONFIG = require('../../config/config')
const { client_secret, client_id, tokenCookieName } = CONFIG
const redirect_uri = CONFIG.host + '/auth/callback'

const {
  getOrCreateUser,
  createUserSession,
  verifyUserSession
} = require('../database')

if (!(client_secret && client_id)) {
  console.log('Warning: check config.js')
}

/*
 *  this function redirects the user to https://accounts.spotify.com/authorize?
 * after loggin in and commiting access to his account, he gets redirected back to
 * redirect_uri
 */

router.post('/verify', function(req, res) {
  const token = req.body ? req.body.token : null
  if (token) {
    verifyUserSession(token)
      .then(isValid => {
        return res.send({ success: isValid, token: token })
      })
      .catch(error => res.send({ isValid: false, token: '' }))
  } else {
    return res.send({ success: false, token: '' })
  }
})
const stateKey = 'spotify_auth_state'
router.get('/login', function(req, res) {
  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = `user-read-private
                 user-read-email
                 user-read-currently-playing
                 user-read-playback-state
                 user-top-read`
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
 */
router.get('/callback', function(req, res) {
  const code = req.query.code || null
  const state = req.query.state || null
  const error = req.query.error || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (error || state === '' || state === null || state !== storedState) {
    console.log(
      'state mismatch',
      'state: ' + state,
      'storedState ' + storedState,
      'error' + error,
      'cookies ',
      req.cookies
    )
    res.send(`res.render('pages/callback', {
      access_token: null,
      expires_in: null
    })`)
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

        /* res.cookie('refresh_token', refresh_token, {
          maxAge: 30 * 24 * 3600 * 1000
        }) */

        getOrCreateUser(access_token, refresh_token, expires_in)
          .then(user => {
            createUserSession(user, access_token, refresh_token, expires_in)
              .then(token => {
                res.cookie(tokenCookieName, token)
                res.redirect('http://localhost:1234')
              })
              .catch(error => console.log(error))
          })
          .catch(error => console.log(error))
      } else {
        res.send(`res.render('pages/callback', {
          access_token: null,
          expires_in: null
        })`)
      }
    })
  }
})
router.post('/token', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const refreshToken = req.body ? req.body.refresh_token : null
  if (refreshToken) {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          expires_in = body.expires_in

        res.setHeader('Content-Type', 'application/json')
        res.send(
          JSON.stringify({
            access_token: access_token,
            expires_in: expires_in
          })
        )
      } else {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({ access_token: '', expires_in: '' }))
      }
    })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ access_token: '', expires_in: '' }))
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
