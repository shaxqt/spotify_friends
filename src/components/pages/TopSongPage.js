import React, { useEffect, useState } from 'react'
import Main from '../utils/Main'
import Song from '../common/Song'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import { getTopSongs } from '../../api/api'
import GridStyled from '../utils/GridStyled'
import { putRequest } from '../../api/fetch'

export default function TopSongPage() {
  const [topSongs, setTopSongs] = useState([])
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const [filteredSongs, setFilteredSongs] = useState([])

  useEffect(_ => {
    getTopSongs().then(setTopSongs)
  }, [])
  useEffect(
    _ => {
      setFilteredSongs(reduceSongs(topSongs))
    },
    [topSongs, friendIdFilter]
  )

  return (
    <Main>
      <GridStyled gap="15px">
        <FriendFilter
          friends={getFriends(topSongs)}
          toggleFilter={toggleFilter}
          activeFilters={friendIdFilter}
        />
        <IconStyled onClick={shuffleAll} className="fa fa-random"></IconStyled>
        {filteredSongs.map(song => {
          return <Song song={song} key={song.song.uri} />
        })}
      </GridStyled>
    </Main>
  )
  function shuffleAll() {
    if (filteredSongs.length > 0) {
      const start_uri =
        filteredSongs[
          Math.floor(Math.random() * Math.floor(filteredSongs.length))
        ].song.uri

      const body = {
        offset: { uri: start_uri },
        uris: filteredSongs.map(song => song.song.uri)
      }
      console.log('body', body)
      putRequest('/user/shuffle', { state: true })
      putRequest('/user/start_playback', body)
    }
  }

  function toggleFilter(userid) {
    const i = friendIdFilter.indexOf(userid)
    let filter = []
    if (i === -1) {
      filter = [...friendIdFilter, userid]
    } else {
      friendIdFilter.splice(i, 1)
      filter = [...friendIdFilter]
    }
    setFriendIdFilter(filter)
  }

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

    let filteredSongs = []
    if (friendIdFilter.length > 0) {
      for (const song of songs) {
        for (const friend of song.friends) {
          if (friendIdFilter.includes(friend.id)) {
            filteredSongs = [...filteredSongs, song]
          }
        }
      }
    } else {
      filteredSongs = songs
    }
    filteredSongs.sort((a, b) => b.song.popularity - a.song.popularity)
    console.log(filteredSongs)
    return filteredSongs
  }
}

const IconStyled = styled.i`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1db954;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  font-size: 25px;
  color: white;
`
