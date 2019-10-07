const router = require('express').Router()
const sanitize = require('mongo-sanitize')

const {
  getContactRequests,
  updateContactRequest,
  getUsersByDisplayName,
  retractContact
} = require('../spotifyApi')

const { getCurrentSong } = require('../spotify_utils')
const { getSessionIfValid } = require('../auth_utils')
const {
  getContacts,
  createContact,
  deleteContact,
  updateContactStatus
} = require('../db_utils')
const { putSpotifyRequest } = require('../request_utils')

router.post('/contacts', async function(req, res) {
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

router.post('/create_contact', async function(req, res) {
  try {
    const { spotify_friends_token, target, message } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      const contact = await createContact(session, target)
      return conact
        ? res.send({ success: true, items: contact })
        : res.send({ success: false, error: 'could not save conacts to db' })
    }
    return res.send({
      success: false,
      error: 'token not valid ' + spotify_friends_token
    })
  } catch (err) {
    console.log('/create_contact', err)
    return res.send({ success: false, error: err })
  }
})

router.post('/retract_contact', async function(req, res) {
  try {
    const { spotify_friends_token, target, message } = req.body
    console.log(spotify_friends_token)
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      const success = await deleteContact(session, target)
      return res.send({ success })
    }
    return res.send({
      success: false,
      error: 'no valid token ' + spotify_friends_token
    })
  } catch (err) {
    console.log('/retract', err)
    return res.send({ success: false, error: err })
  }
})
router.post('/get_requests', async function(req, res) {
  try {
    const { spotify_friends_token } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      const requests = await Contact.find({
        target: session.userID,
        status: 0
      }).exec()
      console.log(requests)
      return res.send({ success: true, items: requests })
    }
    return res.send({
      success: false,
      error: 'token not valid ' + spotify_friends_token
    })
  } catch (error) {
    res.send({ success: false, error })
  }
})

router.post('/accept_request', async function(req, res) {
  try {
    const { spotify_friends_token, source } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      const contact = await updateContactStatus(session, source, 20)
      return contact
        ? res.send({ success: true, items: contact })
        : res.send({ success: false, error: 'coulnd not update contact' })
    }
    return res.send({
      success: false,
      error: 'token not valid ' + spotify_friends_token
    })
  } catch (error) {
    console.log('/accept_request', error)
    res.send({ success: false, error })
  }
})
router.post('/deny_request', async function(req, res) {
  try {
    const { spotify_friends_token, source } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      const contact = await updateContactStatus(session, source, 10)
      return contact
        ? res.send({ success: true, items: contact })
        : res.send({ success: false, error: 'coulnd not update contact' })
    }
    return res.send({
      success: false,
      error: 'token not valid ' + spotify_friends_token
    })
  } catch (error) {
    console.log('/deny_request', error)
    res.send({ success: false, error })
  }
})

module.exports = router
