const router = require('express').Router()
const querystring = require('querystring')
const requestLib = require('request') // "Request" library
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const redirect_uri =
  process.env.SPOTIFY_REDIRECT || 'http://localhost:3333/callback'

/*
 *  this function redirects the user to https://accounts.spotify.com/authorize?
 * after loggin in and commiting access to his account, he gets redirected back to
 * redirect_uri
 */
router.get('/login', function(req, res) {
  // your application requests authorization
  const scope =
    'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-top-read'

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        // where spotify does redirect the user after loggin in
        redirect_uri: redirect_uri
      })
  )
})

/*
 * handles the callback from spotify,
 * extracting the code (from url) to get an access token with another request
 */
router.get('/callback', function(req, res) {
  const accessToken = req.query.code
  console.log('accessToken', accessToken)

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      // code to get access_token
      code: accessToken,
      // does not redirect, but MUST be same as in first request
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64')
    },
    json: true
  }
  // another request with given code the finaly get access token
  requestLib.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      const refresh_token = body.refresh_token

      console.log(access_token)

      getTopTracks(access_token)
      //getCurrPlayingSong(access_token)
      //getMe(access_token)
    } else {
      res.send('fehler')
    }
  })
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

module.exports = router

/*   */

/*
router.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch'
        })
    )
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      console.log('BIN IN POST ################', request)
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true
        }

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          '/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            })
        )
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token'
            })
        )
      }
    })
  }
})

router.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64')
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({
        access_token: access_token
      })
    }
  })
})

const stateKey = 'spotify_auth_state'
module.exports = router
*/
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
/*function generateRandomString(length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  while (text.length < length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
 */
