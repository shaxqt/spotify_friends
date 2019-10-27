import { putRequest } from '../api/fetch'
import { useAlert } from 'react-alert'

export default function useSongFilter(topSongs, friendIdFilter) {
  const alert = useAlert()
  let filteredSongs = []
  if (
    Array.isArray(topSongs) &&
    topSongs.length > 0 &&
    Array.isArray(friendIdFilter) &&
    friendIdFilter.length > 0
  ) {
    for (const song of topSongs) {
      for (const friend of song.friends) {
        if (friendIdFilter.includes(friend.id)) {
          filteredSongs = [...filteredSongs, song]
          break
        }
      }
    }
  } else {
    filteredSongs = topSongs
  }
  const playSongs = async (start_uri = 'random') => {
    if (filteredSongs.length > 0) {
      if (start_uri === 'random') {
        start_uri =
          filteredSongs[
            Math.floor(Math.random() * Math.floor(filteredSongs.length))
          ].song.uri
      }
      const body = {
        offset: { uri: start_uri },
        uris: filteredSongs.map(song => song.song.uri)
      }
      putRequest('/user/shuffle', { state: true })
      const res = await putRequest('/user/start_playback', body)
      if (res && res.response) {
        if (res.response.error) {
          let message = res.response.error.message
          message =
            res.response.error.reason === 'NO_ACTIVE_DEVICE'
              ? 'no active spotify device'
              : message
          message =
            res.response.error.reason === 'PREMIUM_REQUIRED'
              ? 'You need spotify premium account'
              : message
          alert.error(message)
        } else {
          alert.show('playing on spotify...')
        }
      }
    }
  }

  return [filteredSongs, playSongs]
}
