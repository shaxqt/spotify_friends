import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Main from '../utils/Main'
import Song from '../common/Song'
import Artist from '../common/Artist'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import useFriendFilter from '../../hooks/useFriendFilter'
import LoadingSpinner from '../utils/LoadingSpinner'
import FloatingHeader from '../utils/FloatingHeader'
import HeaderButtonRow from '../common/HeaderButtonRow'
import topPageTimeFilter from '../../constants/topPageTimeFilter'
import topPageTypeFilter from '../../constants/topPageTypeFilter'
import VirtualizedList from '../utils/VirtualizedList'
import { useAlert } from 'react-alert'
import { putRequest } from '../../api/fetch'

const Portal = ({ children }) =>
  ReactDOM.createPortal(<>{children}</>, document.body)

export default function TopPage({
  topSongs,
  topArtists,
  isLoading,
  friends,
  activeAudio,
  togglePreview,
  timeFilter,
  setTimeFilter,
  typeFilter,
  setTypeFilter
}) {
  const HEADER_HEIGHT = 190
  const alert = useAlert()
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const shownSongs = useFriendFilter(topSongs[timeFilter], friendIdFilter)
  const shownArists = useFriendFilter(topArtists[timeFilter], friendIdFilter)
  const [showHeader, setShowHeader] = useState(true)
  const LIST_GAP = 10

  return (
    <Main noScroll>
      <FloatingHeader height={HEADER_HEIGHT + 'px'} show={showHeader}>
        <HeaderButtonRow
          label="filter type"
          activeFilter={typeFilter}
          setFilter={setTypeFilter}
          labelValues={topPageTypeFilter}
        />
        <HeaderButtonRow
          label="filter timespan"
          activeFilter={timeFilter}
          setFilter={setTimeFilter}
          labelValues={topPageTimeFilter}
        />
        <FriendFilter
          friends={friends}
          toggleFilter={toggleFilter}
          activeFilters={friendIdFilter}
        />
      </FloatingHeader>
      <FixedDivStyled>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <VirtualizedList
            ITEM_HEIGHT={80}
            list={typeFilter === 'songs' ? shownSongs : shownArists}
            render={typeFilter === 'songs' ? renderSongs : renderArtists}
            setShowHeader={setShowHeader}
            LIST_GAP={LIST_GAP}
            HEADER_HEIGHT={HEADER_HEIGHT}
          />
        )}
      </FixedDivStyled>
      <Portal>
        <IconStyled
          onClick={() => playSongs()}
          className="fa fa-random"
        ></IconStyled>
      </Portal>
    </Main>
  )

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

  function renderSongs(top) {
    return (
      <Song
        top={top}
        onPlay={playSongs}
        togglePreview={togglePreview}
        isPlaying={
          activeAudio &&
          activeAudio.preview_url === top.item.preview_url &&
          activeAudio.isPlaying
        }
      />
    )
  }
  function renderArtists(top) {
    return <Artist top={top} onPlay={playArtist} />
  }
  async function playArtist(context_uri) {
    if (context_uri) {
      const res = await putRequest('/user/start_playback', { context_uri })
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
  async function playSongs(start_uri = 'random') {
    if (shownSongs.length > 0) {
      if (start_uri === 'random') {
        start_uri =
          shownSongs[Math.floor(Math.random() * Math.floor(shownSongs.length))]
            .item.uri
      }
      const body = {
        offset: { uri: start_uri },
        uris: shownSongs.map(song => song.item.uri)
      }
      console.log(body)
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
}

const FixedDivStyled = styled.div`
  height: 100%;
  width: 100%;
  margin-top: ${({ marginTop }) => marginTop + 'px'};
  transition: all 0.3s ease-in-out;
`
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
