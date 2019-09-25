const router = require('express').Router()
const { getSpotifyUserInfo, getSessionFromToken } = require('../spotifyApi')

const handleSpotifyRequest = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  getSessionFromToken(spotify_friends_token)
    .then(session => getSpotifyUserInfo(session, req.originalUrl))
    .then(spotify_response => {
      res.send(spotify_response)
    })
    .catch(error => {
      res.send(error)
    })
}
router.post('/me/', handleSpotifyRequest)
router.post('/me/top/tracks', handleSpotifyRequest)
router.post('/me/player/currently-playing', handleSpotifyRequest)

module.exports = router
