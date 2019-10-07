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
        user.currSong.next_fetch_spotify == null ||
        user.currSong.next_fetch_spotify < Date.now()
      ) {
        console.log('getting new song user: ' + userID)

        const validSession = await getValidSessionForUser(userID)
        if (validSession) {
          // request new current song and save to db
          const res = await getSpotifyRequest(
            validSession.spotify_access_token,
            '/v1/me/player/currently-playing'
          )
          if (res) {
            // return song from db for next 10 secounds
            res.next_fetch_spotify = Date.now() + 10000
            user.currSong = res
            const savedUser = await user.save()
            console.log('returning song just fetched')
            return mapCurrSong(savedUser.currSong)
          }
        }
      }
      console.log('getCurrentSong returning song from db user: ' + userID)
      return mapCurrSong(user.currSong)
    }
  } catch (err) {
    console.log('getCurrSong err:', err)
    return null
  }
}

function mapCurrSong(currSong) {
  if (
    currSong &&
    currSong.item &&
    currSong.item.album &&
    currSong.item.artists
  ) {
    const mapped = {
      next_fetch_in_ms: currSong.item.duration_ms - currSong.progress_ms,
      album_type: currSong.item.album.album_type,
      album: currSong.item.album.name,
      images: currSong.item.album.images,
      artists: currSong.item.artists.map(artist => artist.name),
      is_local: currSong.item.is_local,
      name: currSong.item.name,
      currently_playing_type: currSong.currently_playing_type,
      is_playing: currSong.is_playing,
      timestamp: currSong.timestamp,
      position_ms: currSong.progress_ms,
      context_uri: currSong.context.uri,
      context_type: currSong.context.type,
      uri: currSong.item.uri
    }
    return mapped
  } else {
    return null
  }
}
module.exports = { getCurrentSong }
