const router = require('express').Router()
const { getSpotifyUserInfo } = require('../spotifyApi')

const handleSpotifyRequest = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  getSpotifyUserInfo(spotify_friends_token, req.originalUrl)
    .then(spotify_response => {
      res.send(spotify_response)
    })
    .catch(error => {
      res.send(error)
    })
}
router.post('/me/v1', handleSpotifyRequest)
router.post('/me/top/tracks', handleSpotifyRequest)

module.exports = router
