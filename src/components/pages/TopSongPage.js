import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Main from '../utils/Main'
import Song from '../common/Song'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useShuffle, useTopSongs, useSongFilter } from '../../hooks/TopSongPage'
import LoadingSpinner from '../utils/LoadingSpinner'
import FloatingHeader from '../utils/FloatingHeader'
import TimeFilter from '../common/TimeFilter'
const Portal = ({ children }) =>
  ReactDOM.createPortal(<>{children}</>, document.body)

export default function TopSongPage({ activeAudio, togglePreview }) {
  const HEADER_HEIGHT = 150
  const [timeFilter, setTimeFilter] = useState('short_term')
  const [topSongs, allFriends, loadingData] = useTopSongs(timeFilter)
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [lastScrollBottom, setLastScrollBottom] = useState(0)
  const shownSongs = useSongFilter(topSongs, friendIdFilter)
  const shuffleShownSongs = useShuffle(shownSongs)
  const [showHeader, setShowHeader] = useState(true)

  function onScroll(e) {
    if (e.scrollOffset === 0) {
      setShowHeader(true)
    } else {
      const DELTA = HEADER_HEIGHT
      if (e.scrollDirection === 'backward') {
        if (e.scrollOffset + DELTA < lastScrollTop) {
          setShowHeader(true)
        }
        setLastScrollBottom(e.scrollOffset)
      } else {
        if (e.scrollOffset > lastScrollBottom + DELTA) {
          setShowHeader(false)
        }
        setLastScrollTop(e.scrollOffset)
      }
    }
  }

  return (
    <Main noScroll>
      <FloatingHeader height={HEADER_HEIGHT + 'px'} show={showHeader}>
        <TimeFilter activeFilter={timeFilter} setFilter={setTimeFilter} />
        <FriendFilter
          friends={allFriends}
          toggleFilter={toggleFilter}
          activeFilters={friendIdFilter}
        />
      </FloatingHeader>
      <FixedDivStyled marginTop={showHeader ? HEADER_HEIGHT : 0}>
        {loadingData ? (
          <LoadingSpinner />
        ) : (
          <AutoSizer>
            {({ height, width }) => {
              return (
                <List
                  onScroll={onScroll}
                  className="List"
                  height={height}
                  itemCount={shownSongs.length}
                  itemSize={80}
                  width={width}
                >
                  {renderRow}
                </List>
              )
            }}
          </AutoSizer>
        )}
      </FixedDivStyled>
      <Portal>
        <IconStyled
          onClick={shuffleShownSongs}
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
  function renderRow({ index, style }) {
    if (Array.isArray(shownSongs) && shownSongs.length > index) {
      return (
        <div style={style} key={shownSongs[index].preview_url}>
          <Song
            song={shownSongs[index]}
            togglePreview={togglePreview}
            isPlaying={
              activeAudio &&
              activeAudio.preview_url === shownSongs[index].song.preview_url &&
              activeAudio.isPlaying
            }
          />
        </div>
      )
    } else {
      return null
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
const EmptyStyled = styled.div`
  height: 50px;
`
