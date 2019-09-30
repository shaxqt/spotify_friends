const router = require('express').Router()
const {
  getContacts,
  createContact,
  getContactRequests
} = require('../spotifyApi')

/* router.post('/contacts', function(req, res) {
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  getContacts(spotify_friends_token)
    .then(friends => res.send(JSON.stringify(friends)))
    .catch(error => res.send(error))
}) */

router.post('/create_contact', function(req, res) {
  console.log('/create_contact', req.body)
  const { spotify_friends_token, target, message } = req.body

  createContact(spotify_friends_token, target, message)
    .then(contact => {
      console.log('/create_contact success')
      res.send({ success: true, items: contact })
    })

    .catch(error => {
      console.log('/create_contact fehler')
      res.send({ success: false, error })
    })
})
router.post('/get_requests', function(req, res) {
  console.log('/get_requests', req.body)
  const { spotify_friends_token } = req.body

  getContactRequests(spotify_friends_token)
    .then(requests => {
      console.log('/get_requests success')
      res.send({ success: true, items: requests })
    })

    .catch(error => {
      console.log('/get_requests fehler')
      res.send({ success: false, error })
    })
})

module.exports = router
