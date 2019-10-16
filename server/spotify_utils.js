const { getSpotifyRequest } = require('./request_utils')
const { getValidSessionForUser } = require('./auth_utils')
const Top = require('./Models/Top')
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
const getTop = async ({
  userID,
  type = 'tracks',
  time_range = 'short_term'
}) => {
  try {
    if (
      userID &&
      (type === 'tracks' || type === 'artists') &&
      (time_range === 'short_term' ||
        time_range === 'medium_term' ||
        time_range === 'long_term')
    ) {
      let top = await Top.findOne({ userID, type, time_range }).exec()
      // return song from db if last request was within last 10sec
      if (
        top == null ||
        top.lastFetched == null ||
        top.lastFetched + 1000 * 60 * 60 < Date.now()
      ) {
        console.log(
          'requesting top ' + type + ' ' + time_range + ' for user: ' + userID
        )

        const validSession = await getValidSessionForUser(userID)
        if (validSession) {
          // request new current song and save to db
          const res = await getSpotifyRequest(
            validSession.spotify_access_token,
            '/v1/me/top/' + type + '?time_range=' + time_range
          )
          if (res && res.items) {
            if (!top) {
              top = new Top()
              top.type = type
              top.time_range = time_range
              top.userID = userID
            }
            top.lastFetched = Date.now()
            top.items = res.items
            const savedTop = await top.save()
            return savedTop.items
          }
        }
      } else {
        return top.items
      }
    }
    return null
  } catch (err) {
    console.log('getTop err:', err)
    return null
  }
}

module.exports = { getCurrentSong, getTop }
