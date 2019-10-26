import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Main from '../utils/Main'
import Song from '../common/Song'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { useShuffle, useTopSongs, useSongFilter } from '../../hooks/TopSongPage'
import LoadingSpinner from '../utils/LoadingSpinner'

const Portal = ({ children }) =>
  ReactDOM.createPortal(<>{children}</>, document.body)

export default function TopSongPage({ activeAudio, togglePreview }) {
  const [topSongs, allFriends, loadingData] = useTopSongs()
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const shownSongs = useSongFilter(topSongs, friendIdFilter)
  const shuffleShownSongs = useShuffle(shownSongs)
  const ref = React.createRef(null)

  return (
    <Main ref={ref} noScroll>
      {loadingData ? (
        <LoadingSpinner />
      ) : (
        <>
          <FriendFilter
            friends={allFriends}
            toggleFilter={toggleFilter}
            activeFilters={friendIdFilter}
          />
          <AutoSizer>
            {({ height, width }) => {
              console.log(height)
              return (
                <List
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
          <Portal>
            <IconStyled
              onClick={shuffleShownSongs}
              className="fa fa-random"
            ></IconStyled>
          </Portal>
        </>
      )}
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
