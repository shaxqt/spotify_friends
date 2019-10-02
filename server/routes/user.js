const router = require('express').Router()
const sanitize = require('mongo-sanitize')

const {
  getContacts,
  createContact,
  getContactRequests,
  updateContactRequest,
  getUsersByDisplayName,
  retractContact
} = require('../spotifyApi')

/* router.post('/contacts', function(req, res) {
  const spotify_friends_token = req.body ? req.body.spotify_friends_token : null
  getContacts(spotify_friends_token)
    .then(friends => res.send(JSON.stringify(friends)))
    .catch(error => res.send(error))
}) */

router.post('/get_user', function(req, res) {
  const { spotify_friends_token, query_string } = req.body

  const search = sanitize(query_string)
  getUsersByDisplayName(spotify_friends_token, search)
    .then(users => res.send({ success: true, items: users }))
    .catch(err => res.send({ success: false, error: err }))
})

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
router.post('/retract_contact', function(req, res) {
  console.log('/retract_contact', req.body)
  const { spotify_friends_token, target, message } = req.body

  retractContact(spotify_friends_token, target)
    .then(() => {
      console.log('/retract_contact success')
      res.send({ success: true })
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

router.post('/accept_request', function(req, res) {
  const { spotify_friends_token, contact_id } = req.body
  updateContactRequest(spotify_friends_token, contact_id, 30)
    .then(contact => res.send({ success: true, items: contact }))
    .catch(error => res.send({ success: false, error }))
})
router.post('/deny_request', function(req, res) {
  const { spotify_friends_token, contact_id } = req.body
  updateContactRequest(spotify_friends_token, contact_id, 20)
    .then(contact => res.send({ success: true, items: contact }))
    .catch(error => res.send({ success: false, error }))
})
module.exports = router
