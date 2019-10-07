const router = require('express').Router()
const sanitize = require('mongo-sanitize')

const {
  createContact,
  getContactRequests,
  updateContactRequest,
  getUsersByDisplayName,
  retractContact
} = require('../spotifyApi')

const { getCurrentSong } = require('../spotify_utils')
const { getSessionIfValid, getValidSessionForUser } = require('../auth_utils')
const { getContacts } = require('../db_utils')
const { putSpotifyRequest } = require('../request_utils')

router.get('/contacts', async function(req, res) {
  try {
    const token = req.body ? req.body.spotify_friends_token : null
    const session = await getSessionIfValid(token)
    if (session) {
      const contacts = await getContacts(session)
      return contacts
        ? res.send({ success: true, items: contacts })
        : res.send({ success: false, error: 'no contacts' })
    }
    return res.send({ succes: false, error: 'token not valid ' + token })
  } catch (error) {
    res.send({ success: false, error })
  }
})

router.put('/start_playback', async function(req, res) {
  try {
    const token = req.body ? req.body.spotify_friends_token : null
    const session = await getSessionIfValid(token, true)
    if (session) {
      const { context_uri, position_ms, offset } = req.body
      response = await putSpotifyRequest(
        session.spotify_access_token,
        '/v1/me/player/play',
        {
          context_uri,
          position_ms,
          offset
        }
      )
      return res.send({ success: true, response })
    }
    return res.send({ success: false, error: 'token not valid ' + token })
  } catch (error) {
    res.send({ success: false, error })
  }
})
router.post('/curr_song', async function(req, res) {
  try {
    const token = req.body ? req.body.spotify_friends_token : null
    const session = await getSessionIfValid(token)
    if (session) {
      const currSong = await getCurrentSong(req.body.userID)
      return currSong
        ? res.send({ success: true, items: currSong })
        : res.send({ success: false, error: 'no current song' })
    }
    return res.send({ succes: false, error: 'token not valid ' + token })
  } catch (error) {
    res.send({ success: false, error })
  }
})
router.post('/get_user', function(req, res) {
  const { spotify_friends_token, query_string } = req.body
  console.log('/get_user', spotify_friends_token)
  const search = sanitize(query_string)
  getUsersByDisplayName(spotify_friends_token, search)
    .then(users => res.send({ success: true, items: users }))
    .catch(error => res.send({ success: false, error }))
})

router.post('/create_contact', function(req, res) {
  const { spotify_friends_token, target, message } = req.body
  console.log('/create_contact', spotify_friends_token)

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
  console.log('/retract_contact', spotify_friends_token)
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
  const { spotify_friends_token } = req.body
  console.log('/get_requests', spotify_friends_token)

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
  const { spotify_friends_token, source } = req.body
  console.log('/accept_request', spotify_friends_token)
  updateContactRequest(spotify_friends_token, source, 20)
    .then(contact => res.send({ success: true, items: contact }))
    .catch(error => res.send({ success: false, error }))
})
router.post('/deny_request', function(req, res) {
  const { spotify_friends_token, source } = req.body
  console.log('/deny_request', spotify_friends_token)
  updateContactRequest(spotify_friends_token, source, 10)
    .then(contact => res.send({ success: true, items: contact }))
    .catch(error => res.send({ success: false, error }))
})
module.exports = router
