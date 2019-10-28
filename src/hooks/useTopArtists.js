import { getTopArtists } from '../api/api'
import { useEffect, useState } from 'react'

export default function useTopArtists(time_range) {
  const [isLoading, setIsLoading] = useState(true)
  const [topArtists, setTopArtists] = useState({
    short_term: [],
    medium_term: [],
    long_term: []
  })

  useEffect(
    _ => {
      if (topArtists[time_range].length <= 0) {
        setIsLoading(true)
        getTopArtists(time_range || 'short_term')
          .then(artists => {
            if (artists != null) {
              artists = artists.reduce((acc, curr) => {
                curr.friends = []
                const [sameArtist] = acc.filter(
                  test => test.item.uri === curr.item.uri
                )
                if (sameArtist) {
                  sameArtist.friends = [...sameArtist['friends'], curr.friend]
                  return acc
                } else {
                  curr['friends'].push(curr.friend)
                  return [...acc, curr]
                }
              }, [])

              artists.sort((a, b) => b.item.popularity - a.item.popularity)

              setTopArtists({ ...topArtists, [time_range]: artists })
              setIsLoading(false)
            }
          })
          .catch(err => err)
      }
    },
    [time_range]
  )
  return [topArtists, isLoading]
}
