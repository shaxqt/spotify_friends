const router = require('express').Router()
const querystring = require('querystring')
const requestLib = require('request')

const CONFIG = require('../../config/config')
const { client_secret, client_id } = CONFIG
const redirect_uri = CONFIG.host + '/auth/callback'

if (!(client_secret && client_id)) {
  console.log('Warning: check config.js')
}

/*
 *  this function redirects the user to https://accounts.spotify.com/authorize?
 * after loggin in and commiting access to his account, he gets redirected back to
 * redirect_uri
 */
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
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === '' || state === null || state !== storedState) {
    console.log(
      'state mismatch',
      'state: ' + state,
      'storedState ' + storedState,
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
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    }

    requestLib.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token, expires_in } = body

        res.cookie('refresh_token', refresh_token, {
          maxAge: 30 * 24 * 3600 * 1000
        })

        // hier müsste jetzt halt meine Seite aufgerufen werden
        // weil man ja erfolgreich eingloggt wurde
        res.redirect(
          'http://localhost:1234?' +
            querystring.stringify({
              access_token: access_token,
              expires_in: expires_in,
              refresh_token: refresh_token
            })
        )
        /*  res.render('template?', {
          access_token: access_token,
          expires_in: expires_in,
          refresh_token: refresh_token
        }) */
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
  res.setHeader('Access-Control-Allow-Origin', '*') // ?
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

function getCurrPlayingSong(access_token) {
  const options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true
  }

  // use the access token to get curr playing song
  requestLib.get(options, function(error, response, body) {
    console.log('ANTWORT VON v1/me/player/currently-playing', body)
  })
}
function getMe(access_token) {
  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true
  }
  // use the access token to access the Spotify Web API
  requestLib.get(options, function(error, response, body) {
    console.log('ANTWORT VON v1/me Request', body)
  })
}
function getTopTracks(access_token) {
  const options = {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true
  }
  // use the access token to access the Spotify Web API
  requestLib.get(options, function(error, response, body) {
    console.log('ANTWORT VON v1/me/top/tracks Request', body)
  })
}

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
