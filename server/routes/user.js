const router = require('express').Router()
const { getCurrentSong, getTops } = require('../spotify_utils')
const { getSessionIfValid, deleteUserSessions } = require('../auth_utils')
const { putSpotifyRequest, getSpotifyRequest } = require('../request_utils')
const {
  getContacts,
  getRequests,
  createContact,
  deleteContact,
  acceptOrDenyContact,
  searchUsersByDisplayName,
  userUpdateSettings,
  getMe
} = require('../db_utils')
const clients = require('../clients')

router.put('/shuffle', function(req, res) {
  withValidSession(req, res, async session => {
    await putSpotifyRequest(
      session.spotify_access_token,
      '/v1/me/player/shuffle?state=' + !!req.body.state
    )
  })
})
router.post('/top', function(req, res) {
  withValidSession(req, res, async session => {
    const response = await getTops({ session, ...req.body })
    response
      ? res.send({ success: true, items: response })
      : res.send({ success: false })
  })
})

router.delete('/session', function(req, res) {
  withValidSession(req, res, async session => {
    const { deleteAllSessions } = req.body
    const response = await deleteUserSessions(session, !!deleteAllSessions)
    return response.deletedCount > 0
      ? res.send({ success: true, deletedCount: response.deletedCount })
      : res.send({ success: false })
  })
})
router.post('/contacts', async function(req, res) {
  withValidSession(req, res, async session => {
    const contacts = await getContacts(session)
    for (const contact of contacts) {
      const res = await getCurrentSong(contact.id)
      if (res) {
        contact.currSong = res.currSong
      }
    }
    return contacts
      ? res.send({ success: true, items: contacts })
      : res.send({ success: false, error: 'no contacts' })
  })
})

router.post('/get_devices', async function(req, res) {
  withValidSession(req, res, async session => {
    const response = await getSpotifyRequest(
      session.spotify_access_token,
      '/v1/me/player/devices'
    )
    return response && response.devices
      ? res.send({ success: true, items: response.devices })
      : res.send({ success: false })
  })
})
router.put('/start_playback', async function(req, res) {
  withValidSession(req, res, async session => {
    response = await putSpotifyRequest(
      session.spotify_access_token,
      '/v1/me/player/play',
      req.body
    )
    console.log('start_playback', response)
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
    if (contact) {
      clients.emitToUserIDs([contact.target], 'update_requests')
      res.send({ success: true, items: contact })
    } else {
      res.send({ success: false, error: 'could not save conacts to db' })
    }
  })
})

router.post('/retract_contact', async function(req, res) {
  withValidSession(req, res, async session => {
    const { target } = req.body
    const success = await deleteContact(session, target)
    success && clients.emitToUserIDs([target], 'update_requests')
    return res.send({ success })
  })
})
router.post('/get_requests', async function(req, res) {
  withValidSession(req, res, async session => {
    const requests = await getRequests(session)
    return res.send({ success: true, items: requests })
  })
})

router.post('/get_me', async function(req, res) {
  withValidSession(req, res, async session => {
    const me = await getMe(session)
    return me
      ? res.send({ success: true, item: me })
      : res.send({ success: false })
  })
})
router.post('/update_settings', async function(req, res) {
  withValidSession(req, res, async session => {
    const user = await userUpdateSettings(session, req.body)
    return user
      ? res.send({ success: true, item: user })
      : res.send({ success: false })
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
    const { source } = req.body
    const contact = await acceptOrDenyContact(session, source, accept)
    if (contact) {
      accept && clients.emitToUserIDs([contact.source], 'update_friends')
      res.send({ success: true, items: contact })
    } else {
      res.send({ success: false, error: 'coulnd not update contact' })
    }
  })
}
async function withValidSession(req, res, callback) {
  try {
    const { spotify_friends_token } = req.body
    const session = await getSessionIfValid(spotify_friends_token)
    if (session) {
      delete req.body.spotify_friends_token
      await callback(session)
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
