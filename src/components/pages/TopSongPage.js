import React, { useState, forwardRef } from 'react'
import ReactDOM from 'react-dom'
import Main from '../utils/Main'
import Song from '../common/Song'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import useSongFilter from '../../hooks/useSongFilter'
import LoadingSpinner from '../utils/LoadingSpinner'
import FloatingHeader from '../utils/FloatingHeader'
import TimeFilter from '../common/TimeFilter'
const Portal = ({ children }) =>
  ReactDOM.createPortal(<>{children}</>, document.body)

export default function TopSongPage({
  topSongs,
  timeFilter,
  setTimeFilter,
  isLoading,
  friends,
  activeAudio,
  togglePreview
}) {
  const HEADER_HEIGHT = 150
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const [shownSongs, playSongs] = useSongFilter(
    topSongs[timeFilter],
    friendIdFilter
  )
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [lastScrollBottom, setLastScrollBottom] = useState(0)
  const [showHeader, setShowHeader] = useState(true)

  const LIST_GAP = 10
  const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
      ref={ref}
      style={{
        ...style,
        height: `${parseFloat(style.height) + HEADER_HEIGHT * 3}px`
      }}
      {...rest}
    />
  ))
  return (
    <Main noScroll>
      <FloatingHeader height={HEADER_HEIGHT + 'px'} show={showHeader}>
        <TimeFilter activeFilter={timeFilter} setFilter={setTimeFilter} />
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
          <AutoSizer>
            {({ height, width }) => {
              return (
                <List
                  overscanCount={1}
                  onScroll={onScroll}
                  className="List"
                  height={height}
                  itemCount={shownSongs.length}
                  itemSize={80 + LIST_GAP}
                  width={width}
                  innerElementType={innerElementType}
                >
                  {renderSong}
                </List>
              )
            }}
          </AutoSizer>
        )}
      </FixedDivStyled>
      <Portal>
        <IconStyled onClick={playSongs} className="fa fa-random"></IconStyled>
      </Portal>
    </Main>
  )

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

  function renderSong({ index, style }) {
    if (Array.isArray(shownSongs) && shownSongs.length > index) {
      return (
        <div
          style={{
            ...style,
            paddingTop: LIST_GAP,
            top: `${parseFloat(style.top) + HEADER_HEIGHT}px`
          }}
          key={shownSongs[index].song.uri}
        >
          <Song
            song={shownSongs[index]}
            onPlay={playSongs}
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
