const { getSpotifyRequest } = require('./request_utils')
const { getValidSessionForUser } = require('./auth_utils')
const { getContacts, getMe, findContacts } = require('./db_utils')
const clientHandler = require('./clients')
const Top = require('./Models/Top')
const User = require('./Models/User')

const startCurrSongFetchIntervall = _ => {
  setInterval(async _ => {
    try {
      const users = await User.find().exec()
      for (const user of users) {
        const { currSong, isSongNew } = await getCurrentSong('', user, true)
        if (isSongNew) {
          let friends = await findContacts(user.id)
          friends = friends.map(f =>
            user.id === f.target ? f.source : f.target
          )
          clientHandler.emitToUserIDs(friends, 'newsong', {
            userID: user.id,
            currSong
          })
        }
      }
    } catch (err) {
      console.log(err)
    }
  }, 5 * 1000)
}
const startTopSongFetchIntervall = _ => {
  setInterval(async _ => {
    try {
      const users = await User.find().exec()
      for (const user of users) {
        getTop({ userID: user.id })
      }
    } catch (err) {
      console.log(err)
    }
  }, 5 * 60 * 60 * 1000)
}

const getCurrentSong = async (userID = '', user, tryRefresh = false) => {
  try {
    if (!user) {
      user = await User.findOne({ id: userID }).exec()
    }
    // return song from db if last request was within last 10sec
    if (user) {
      let isSongNew = false
      if (
        user.currSong == null ||
        user.fetchedCurrSong == null ||
        user.fetchedCurrSong + 10000 < Date.now()
      ) {
        let currSongUri =
          user && user.currSong && user.currSong.item && user.currSong.item.uri
            ? user.currSong.item.uri
            : null
        const validSession = await getValidSessionForUser(user.id, tryRefresh)
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
            isSongNew = currSongUri !== res.item.uri
            if (isSongNew) {
              cleanUpSongItem(res.item)
              user.currSong = res
            }
          }
        } else {
        }
        // set fetch time, if song was fetched
        user.fetchedCurrSong = Date.now()
      }
      const savedUser = await user.save()
      return { currSong: savedUser.currSong, isSongNew }
    }
  } catch (err) {
    console.log('getCurrSong err:', err)
    return null
  }
}
const getTops = async options => {
  const friends = await getContacts(options.session)
  let tops = []
  for (const friend of friends) {
    let topOfFriend = await getTop({ ...options, userID: friend.id })
    if (Array.isArray(topOfFriend)) {
      topOfFriend = topOfFriend.map(top => ({
        song: top,
        friend
      }))
      tops = [...tops, ...topOfFriend]
    }
  }
  const user = await getMe(options.session)
  let ownTops = await getTop({ ...options, userID: session.userID })
  if (Array.isArray(ownTops)) {
    ownTops = ownTops.map(top => ({
      song: top,
      friend: {
        display_name: user.display_name,
        id: user.id,
        images: user.images
      }
    }))
    return [...tops, ...ownTops]
  } else {
    return tops
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
        const validSession = await getValidSessionForUser(userID)
        if (validSession) {
          // request new current song and save to db
          const res = await getSpotifyRequest(
            validSession.spotify_access_token,
            '/v1/me/top/' + type + '?time_range=' + time_range
          )
          if (res && res.items) {
            if (top == null) {
              top = new Top()
              top.type = type
              top.time_range = time_range
              top.userID = userID
            }

            top.lastFetched = Date.now()
            top.items = res.items.map(songItem => cleanUpSongItem(songItem))
            top = await top.save()
          }
        }
      }
      return top != null && Array.isArray(top.items) ? top.items : null
    }
    return null
  } catch (err) {
    console.log('getTop err:', err)
    return null
  }
}

function cleanUpSongItem(songObject) {
  delete songObject.album.available_markets
  delete songObject.album.external_urls
  delete songObject.album.href
  delete songObject.album.total_tracks
  delete songObject.available_markets
  delete songObject.disc_number
  delete songObject.disc_number
  delete songObject.external_ids
  delete songObject.external_urls
  delete songObject.href
  delete songObject.track_number

  return songObject
}

module.exports = {
  getCurrentSong,
  getTops,
  startCurrSongFetchIntervall,
  startTopSongFetchIntervall
}
