const { getSpotifyRequest } = require('./request_utils')
const { getValidSessionForUser } = require('./auth_utils')
const User = require('./Models/User')

const getCurrentSong = async userID => {
  try {
    const user = await User.findOne({ id: userID }).exec()
    // return song from db if last request was within last 10sec
    if (user) {
      if (
        user.currSong == null ||
        user.fetchedCurrSong == null ||
        user.fetchedCurrSong + 10000 < Date.now()
      ) {
        console.log('requesting currSong for user: ' + userID)

        const validSession = await getValidSessionForUser(userID)
        if (validSession) {
          // request new current song and save to db
          const res = await getSpotifyRequest(
            validSession.spotify_access_token,
            '/v1/me/player/currently-playing'
          )
          // currently_playing_type can be 'ad' or 'unknown' -> dont save that to db
          if (
            res &&
            (res.currently_playing_type === 'track' ||
              res.currently_playing_type === 'episode')
          ) {
            user.currSong = res
            console.log('updated song for user ' + userID)
          }
        }
        // set fetch time, if song was fetched
        user.fetchedCurrSong = Date.now()
      }
      const savedUser = await user.save()
      return savedUser.currSong
    }
  } catch (err) {
    console.log('getCurrSong err:', err)
    return null
  }
}

module.exports = { getCurrentSong }
