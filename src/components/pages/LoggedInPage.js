import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import ContactPage from './ContactPage'
import FriendsPage from './FriendsPage'
import TopSongPage from './TopSongPage'
import SettingsPage from './SettingsPage'
import Navigation from '../utils/Navigation'
import { getFriends, getTopSongs } from '../../api/api'
import { bindKeyboard } from 'react-swipeable-views-utils'
import SocketContext from '../../context/SocketContext'

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews)

export default function LoggedInPage({ setIsLoggedIn }) {
  const [slideIndex, setSlideIndex] = useState(1)
  const [friends, setFriends] = useState([])
  const [topSongs, setTopSongs] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [requestCount, setRequestCount] = useState(0)
  const [newSong, setNewSong] = useState({})
  const [activeAudio, setActiveAudio] = useState({
    audio: null,
    preview_url: '',
    isPlaying: false
  })
  const socket = React.useContext(SocketContext)

  useEffect(
    _ => {
      getFriends().then(friends => {
        getFriends().then(setFriends)
        setLoadingFriends(false)
        getTopSongs().then(setTopSongs)
      })
      socket.on('update_friends', data => {
        console.log('updating your friends')
        getFriends().then(setFriends)
        getTopSongs().then(setTopSongs)
      })
      socket.on('newsong', data => {
        setNewSong(data)
      })
    },
    [socket]
  )
  useEffect(
    _ => {
      if (newSong['userID'] && newSong['currSong']) {
        const friendToReplace = friends.find(f => f.id === newSong['userID'])
        if (friendToReplace) {
          setFriends(
            friends.map(f =>
              f === friendToReplace ? { ...f, currSong: newSong.currSong } : f
            )
          )
        }
      }
    },
    [newSong]
  )

  return (
    <>
      <BindKeyboardSwipeableViews
        containerStyle={{ maxHeight: '100%' }}
        resistance
        onChangeIndex={index => setSlideIndex(index)}
        index={slideIndex}
      >
        <ContactPage setRequestCount={setRequestCount} />
        <FriendsPage
          friends={friends}
          isLoading={loadingFriends}
          activeAudio={activeAudio}
          togglePreview={togglePreview}
        />
        <TopSongPage
          activeAudio={activeAudio}
          togglePreview={togglePreview}
          topSongs={topSongs}
        ></TopSongPage>
        <SettingsPage setIsLoggedIn={setIsLoggedIn} active={slideIndex === 3} />
      </BindKeyboardSwipeableViews>

      <Navigation slideIndex={slideIndex}>
        {withNavButtonStyled(0, 'fa fa-search', requestCount)}
        {withNavButtonStyled(1, 'fa fa-users')}
        {withNavButtonStyled(2, 'fa fa-headphones')}
        {withNavButtonStyled(3, 'fa fa-cogs')}
      </Navigation>
    </>
  )
  function withNavButtonStyled(index, btnClass, count) {
    return (
      <NavButtonStyled
        key={index}
        alignItems="center"
        activeSlide={index === slideIndex}
        justifyContent="center"
        as="button"
        onClick={() => {
          setSlideIndex(index)
        }}
      >
        <i className={btnClass}></i>
        {count > 0 && (
          <NavButtonInfoStyled>{count > 99 ? '*' : count}</NavButtonInfoStyled>
        )}
      </NavButtonStyled>
    )
  }
  function togglePreview(preview_url) {
    if (preview_url != null && preview_url !== '') {
      if (activeAudio.preview_url === preview_url) {
        if (activeAudio.isPlaying) {
          activeAudio.audio.pause()
          setActiveAudio({ ...activeAudio, isPlaying: false })
        } else {
          activeAudio.audio.play()
          setActiveAudio({ ...activeAudio, isPlaying: true })
        }
      } else {
        if (activeAudio.audio) {
          activeAudio.audio.pause()
        }
        let audio = new Audio(preview_url)
        audio.play()
        setActiveAudio({ audio, isPlaying: true, preview_url })
      }
    }
  }
}
const NavButtonStyled = styled(GridStyled)`
  background-color: #222;
  position: relative;
  border: none;
  outline: none;
  color: ${({ activeSlide }) => (activeSlide ? '#1DB954' : '#555')};
  font-size: ${({ activeSlide }) => (activeSlide ? '25px' : '22px')};
  transition: ease-in-out 0.1s;
`
const NavButtonInfoStyled = styled.div`
  color: #fff;
  font-size: 14px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 50%;
  transform: translateX(5px);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  background-color: #1db954;
`
