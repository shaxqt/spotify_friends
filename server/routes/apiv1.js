const router = require('express').Router()
const { spotifyMeGet } = require('../spotifyApi')

const spotifyUserRequest = (req, res) => {
  console.log('spotifyUserRequest')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  spotifyMeGet(spotify_friends_token, req.originalUrl)
    .then(spotify_response => {
      console.log(spotify_response)
      res.send(spotify_response)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
  console.log('spotifyUserRequest Ende')
}

router.post('/me/top/tracks', function(req, res) {
  console.log('spotifyUserRequest')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  spotifyMeGet(spotify_friends_token, req.originalUrl)
    .then(spotify_response => {
      console.log(spotify_response)
      res.send(spotify_response)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
  console.log('spotifyUserRequest Ende')
})

router.post('/me', function(req, res) {
  console.log('spotifyUserRequest')
  res.setHeader('Access-Control-Allow-Origin', '*')
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  spotifyMeGet(spotify_friends_token, req.originalUrl)
    .then(spotify_response => {
      console.log(spotify_response)
      res.send(spotify_response)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
  console.log('spotifyUserRequest Ende')
})

module.exports = router

/* request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
            expires_in = body.expires_in

        res.setHeader('Content-Type', 'application/json')
        res.send(
            JSON.stringify({
                access_token: access_token,
                expires_in: expires_in
            })
        ) */
