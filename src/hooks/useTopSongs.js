import { getTopSongs } from '../api/api'
import { useEffect, useState } from 'react'

export default function useTopSongs(time_range) {
  const [isLoading, setIsLoading] = useState(true)
  const [topSongs, setTopSongs] = useState({
    short_term: [],
    medium_term: [],
    long_term: []
  })

  useEffect(
    _ => {
      if (topSongs[time_range].length <= 0) {
        setIsLoading(true)
        getTopSongs(time_range || 'short_term')
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

              setTopSongs({ ...topSongs, [time_range]: songs })
              setIsLoading(false)
            }
          })
          .catch(err => err)
      }
    },
    [time_range]
  )
  return [topSongs, isLoading]
}
