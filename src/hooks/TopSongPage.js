import { putRequest } from '../api/fetch'
import { useAlert } from 'react-alert'
import { getTopSongs } from '../api/api'
import React, { useEffect, useState, useCallback } from 'react'

export function useShuffle(shownSongs) {
  const alert = useAlert()

  return useCallback(async _ => {
    if (shownSongs.length > 0) {
      const start_uri =
        shownSongs[Math.floor(Math.random() * Math.floor(shownSongs.length))]
          .song.uri

      const body = {
        offset: { uri: start_uri },
        uris: shownSongs.map(song => song.song.uri)
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
  })
}
export function useFriendFilter(topSongs, friendIdFilter) {
  const [shownSongs, setShownSongs] = useState([])

  useEffect(
    _ => {
      let filteredSongs = []
      if (topSongs.length > 0 && friendIdFilter.length > 0) {
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
      setShownSongs(filteredSongs)
    },
    [topSongs, friendIdFilter]
  )

  return shownSongs
}
export function useTopSongs() {
  const [allFriends, setAllFriends] = useState([])
  const [topSongs, setTopSongs] = useState([])

  useEffect(_ => {
    getTopSongs()
      .then(songs => {
        if (songs != null) {
          songs = songs.reduce((acc, curr) => {
            curr.friends = []
            const [sameSong] = acc.filter(
              test => test.song.uri === curr.song.uri
            )
            if (sameSong) {
              sameSong.friends = [...sameSong['friends'], curr.friend]
              return acc
            } else {
              curr['friends'].push(curr.friend)
              return [...acc, curr]
            }
          }, [])

          songs.sort((a, b) => b.song.popularity - a.song.popularity)
          if (songs) {
            let friends = songs.reduce((acc, curr) => {
              const [sameFriend] = acc.filter(f => f.id === curr.friend.id)
              return sameFriend ? [...acc] : [...acc, curr.friend]
            }, [])
            setAllFriends(friends)
          }
          setTopSongs(songs)
        }
      })
      .catch(err => err)
  }, [])
  return [topSongs, allFriends]
}
