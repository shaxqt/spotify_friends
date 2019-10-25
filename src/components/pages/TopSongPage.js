import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Main from '../utils/Main'
import Song from '../common/Song'
import styled from 'styled-components'
import FriendFilter from '../common/FriendFilter'
import GridStyled from '../utils/GridStyled'
import Lazyload from 'react-lazyload'
import { forceCheck } from 'react-lazyload'
import { ScaleLoader } from 'react-spinners'
import {
  useFriendFilter,
  useShuffle,
  useTopSongs
} from '../../hooks/TopSongPage'

const Portal = ({ children }) =>
  ReactDOM.createPortal(<>{children}</>, document.body)

export default function TopSongPage({
  activeAudio,
  togglePreview,
  active,
  isLoading
}) {
  const [friendIdFilter, setFriendIdFilter] = useState([])
  const [topSongs, allFriends] = useTopSongs()
  const shownSongs = useFriendFilter(topSongs, friendIdFilter)
  const shuffleShownSongs = useShuffle(shownSongs)
  const ref = React.createRef()
  useEffect(_ => forceCheck(), [shownSongs, active])

  return (
    <Main>
      <FriendFilter
        friends={allFriends}
        toggleFilter={toggleFilter}
        activeFilters={friendIdFilter}
      />
      <GridStyled gap="15px" justifyItems="center" ref={ref}>
        {active && (
          <Portal>
            <IconStyled
              onClick={shuffleShownSongs}
              className="fa fa-random"
            ></IconStyled>
          </Portal>
        )}
        {isLoading ? (
          <p>loading... </p>
        ) : (
          shownSongs.map(song => {
            return (
              <Lazyload
                key={song.song.uri}
                height={80}
                overflow
                throttle={200}
                placeholder={<ScaleLoader css="height: 80px;" />}
              >
                <Song
                  song={song}
                  togglePreview={togglePreview}
                  isPlaying={
                    song.song.preview_url === activeAudio.preview_url &&
                    activeAudio.isPlaying
                  }
                />
              </Lazyload>
            )
          })
        )}
        <EmptyStyled />
      </GridStyled>
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
