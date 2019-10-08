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
    const contacts = await getContacts(session)
    for (const contact of contacts) {
      console.log(contact.id)
      const currSong = await getCurrentSong(contact.id)
      contact.currSong = currSong
    }
    contacts
      ? res.send({ success: true, items: contacts })
      : res.send({ success: false, error: 'no contacts' })
  })
})

router.put('/start_playback', async function(req, res) {
  withValidSession(req, res, async session => {
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
  })
})

router.post('/get_user', function(req, res) {
  withValidSession(req, res, async session => {
    const users = await searchUsersByDisplayName(session, req.body.query_string)
    return users
      ? res.send({ success: true, items: users })
      : res.send({ success: false, error })
  })
})

router.post('/create_contact', async function(req, res) {
  withValidSession(req, res, async session => {
    const contact = await createContact(session, req.body.target)
    return contact
      ? res.send({ success: true, items: contact })
      : res.send({ success: false, error: 'could not save conacts to db' })
  })
})

router.post('/retract_contact', async function(req, res) {
  withValidSession(req, res, async session => {
    const { target } = req.body
    const success = await deleteContact(session, target)
    return res.send({ success })
  })
})
router.post('/get_requests', async function(req, res) {
  withValidSession(req, res, async session => {
    const requests = await getRequests(session)
    return res.send({ success: true, items: requests })
  })
})

router.post('/accept_request', async function(req, res) {
  await handleRequest(req, res, true)
})
router.post('/deny_request', async function(req, res) {
  await handleRequest(req, res, false)
})

async function handleRequest(req, res, accept = true) {
  withValidSession(req, res, async session => {
    throw 9
    const { source } = req.body
    const contact = await acceptOrDenyContact(session, source, accept)
    return contact
      ? res.send({ success: true, items: contact })
      : res.send({ success: false, error: 'coulnd not update contact' })
  })
}
async function withValidSession(req, res, callback) {
  try {
    const { spotify_friends_token } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      /*  try { */
      await callback(session)
      /* } catch (error) {
        res.send({ success: false, error })
      } */
    } else {
      res.send({
        success: false,
        error: 'token not valid ' + spotify_friends_token
      })
    }
  } catch (error) {
    console.log('withValidSession', error)
    res.send({ success: false, error })
  }
}
module.exports = router
