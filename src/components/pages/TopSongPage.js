import React, { useEffect, useState } from 'react'
import Main from '../utils/Main'
import Song from '../common/Song'
import FriendFilter from '../common/FriendFilter'
import { getTopSongs } from '../../api/api'

export default function TopSongPage() {
  const [topSongs, setTopSongs] = useState([])
  const [friendFilter, setFriendFilter] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])

  useEffect(_ => {
    getTopSongs().then(setTopSongs)
  }, [])
  useEffect(
    _ => {
      setFriendFilter(getFriends(topSongs))
      setFilteredSongs(reduceSongs(topSongs))
    },
    [topSongs]
  )
  return (
    <Main>
      <FriendFilter friends={getFriends(topSongs)} />
      {filteredSongs.map(song => (
        <Song
          key={song.song.uri}
          title={song.song.name}
          friends={song.friends}
          uri={song.song.uri}
        />
      ))}
    </Main>
  )

  function getFriends(songs) {
    let friends = songs.reduce((acc, curr) => {
      const [sameFriend] = acc.filter(f => f.id === curr.friend.id)
      return sameFriend ? [...acc] : [...acc, curr.friend]
    }, [])
    return friends
  }
  function reduceSongs(songs) {
    songs = topSongs.reduce((acc, curr) => {
      curr.friends = []
      const [sameSong] = acc.filter(test => test.song.uri === curr.song.uri)
      if (sameSong) {
        sameSong.friends = [...sameSong['friends'], curr.friend]
        return acc
      } else {
        curr['friends'].push(curr.friend)
        return [...acc, curr]
      }
    }, [])
    return songs
  }
}
