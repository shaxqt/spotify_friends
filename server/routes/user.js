const router = require('express').Router()
const { getCurrentSong } = require('../spotify_utils')
const { getSessionIfValid } = require('../auth_utils')
const { putSpotifyRequest } = require('../request_utils')
const {
  getContacts,
  getRequests,
  createContact,
  deleteContact,
  acceptOrDenyContact,
  searchUsersByDisplayName
} = require('../db_utils')

router.post('/contacts', async function(req, res) {
  withValidSession(req, res, async session => {
    try {
      const contacts = await getContacts(session)
      return contacts
        ? res.send({ success: true, items: contacts })
        : res.send({ success: false, error: 'no contacts' })
    } catch (error) {
      res.send({ succes: false, error })
    }
  })
})

router.put('/start_playback', async function(req, res) {
  withValidSession(req, res, async session => {
    try {
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
    } catch (error) {
      res.send({ success: false, error })
    }
  })
})
router.post('/curr_song', async function(req, res) {
  withValidSession(req, res, async session => {
    try {
      const currSong = await getCurrentSong(req.body.userID)
      return currSong
        ? res.send({ success: true, items: currSong })
        : res.send({ success: false, error: 'no current song' })
    } catch (error) {
      res.send({ success: false, error })
    }
  })
})
router.post('/get_user', function(req, res) {
  withValidSession(req, res, async session => {
    try {
      const users = await searchUsersByDisplayName(
        session,
        req.body.query_string
      )
      return users
        ? res.send({ success: true, items: users })
        : res.send({ success: false, error })
    } catch (error) {
      res.send({ error: false, error })
    }
  })
})

router.post('/create_contact', async function(req, res) {
  withValidSession(req, res, async session => {
    try {
      const contact = await createContact(session, req.body.target)
      return contact
        ? res.send({ success: true, items: contact })
        : res.send({ success: false, error: 'could not save conacts to db' })
    } catch (error) {
      return res.send({ success: false, error })
    }
  })
})

router.post('/retract_contact', async function(req, res) {
  withValidSession(req, res, async session => {
    try {
      const { target } = req.body
      const success = await deleteContact(session, target)
      return res.send({ success })
    } catch (error) {
      return res.send({ success: false, error })
    }
  })
})
router.post('/get_requests', async function(req, res) {
  withValidSession(req, res, async session => {
    try {
      const requests = await getRequests(session)
      return res.send({ success: true, items: requests })
    } catch (error) {
      res.send({ success: false, error })
    }
  })
})

router.post('/accept_request', async function(req, res) {
  handleRequest(req, res, true)
})
router.post('/deny_request', async function(req, res) {
  handleRequest(req, res, false)
})

async function handleRequest(req, res, accept = true) {
  withValidSession(req, res, async session => {
    try {
      const { source } = req.body
      const contact = await acceptOrDenyContact(session, source, accept)
      return contact
        ? res.send({ success: true, items: contact })
        : res.send({ success: false, error: 'coulnd not update contact' })
    } catch (error) {
      res.send({ success: false, error })
    }
  })
}
async function withValidSession(req, res, callback) {
  try {
    const { spotify_friends_token } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      callback(session)
    } else {
      res.send({
        success: false,
        error: 'token not valid ' + spotify_friends_token
      })
    }
  } catch (err) {
    console.log('withValidSession', err)
    res.send({ success: false, error })
  }
}
module.exports = router
