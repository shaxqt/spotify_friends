const router = require('express').Router()
const { getContacts, createContact } = require('../spotifyApi')

router.post('/contacts', function(req, res) {
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  getContacts(spotify_friends_token)
    .then(friends => res.send(JSON.stringify(friends)))
    .catch(error => res.send(error))
})

router.post('/create_contact', function(req, res) {
  const { spotify_friends_token, target } = req.body
    ? req.body.spotify_friends_token
    : null
  createContact(spotify_friends_token, target)
    .then(contact => res.send(contact))
    .catch(err => res.send(error))
})

module.exports = router
