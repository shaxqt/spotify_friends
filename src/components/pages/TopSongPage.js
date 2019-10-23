import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Main from '../utils/Main'
import Song from '../common/Song'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import GridStyled from '../utils/GridStyled'
import { putRequest } from '../../api/fetch'
import { useAlert } from 'react-alert'
const Portal = ({ children }) =>
  ReactDOM.createPortal(<>{children}</>, document.body)

export default function TopSongPage({
  topSongs,
  activeAudio,
  togglePreview,
  active,
  isLoading
}) {
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const [filteredSongs, allFriends] = useTopSongs(topSongs, friendIdFilter)
  const alert = useAlert()

  return (
    <Main>
      <GridStyled gap="15px">
        <FriendFilter
          friends={allFriends}
          toggleFilter={toggleFilter}
          activeFilters={friendIdFilter}
        />
        {active && (
          <Portal>
            <IconStyled
              onClick={shuffleAll}
              className="fa fa-random"
            ></IconStyled>
          </Portal>
        )}
        {isLoading ? (
          <p>loading... </p>
        ) : (
          filteredSongs.map(song => {
            return (
              <Song
                song={song}
                key={song.song.uri}
                togglePreview={togglePreview}
                isPlaying={
                  song.song.preview_url === activeAudio.preview_url &&
                  activeAudio.isPlaying
                }
              />
            )
          })
        )}
        <EmptyStyled />
      </GridStyled>
    </Main>
  )

  async function shuffleAll() {
    if (filteredSongs.length > 0) {
      const start_uri =
        filteredSongs[
          Math.floor(Math.random() * Math.floor(filteredSongs.length))
        ].song.uri

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
  function useTopSongs(topSongs, friendIdFilter) {
    const [allFriends, setAllFriends] = useState([])
    const [filteredSongs, setFilteredSongs] = useState([])
    useEffect(
      _ => {
        let songs = topSongs
        if (songs != null) {
          songs = topSongs.slice()
          songs = topSongs.reduce((acc, curr) => {
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

          let songsIdFilter = []
          if (friendIdFilter.length > 0) {
            for (const song of songs) {
              for (const friend of song.friends) {
                if (friendIdFilter.includes(friend.id)) {
                  songsIdFilter = [...songsIdFilter, song]
                  break
                }
              }
            }
          } else {
            songsIdFilter = songs
          }
          songsIdFilter.sort((a, b) => b.song.popularity - a.song.popularity)
          setFilteredSongs(songsIdFilter)
        }
        songs = topSongs
        if (songs) {
          let friends = songs.reduce((acc, curr) => {
            const [sameFriend] = acc.filter(f => f.id === curr.friend.id)
            return sameFriend ? [...acc] : [...acc, curr.friend]
          }, [])
          setAllFriends(friends)
        }
      },
      [topSongs, friendIdFilter]
    )
    return [filteredSongs, allFriends]
  }
}

const IconStyled = styled.i`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1db954;
  border-radius: 50%;
  bottom: 65px;
  right: 10px;
  position: fixed;
  font-size: 25px;
  color: white;
`
const EmptyStyled = styled.div`
  height: 50px;
`
