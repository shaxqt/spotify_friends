import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import ContactPage from './ContactPage'
import FriendsPage from './FriendsPage'
import SettingsPage from './SettingsPage'
import Navigation from '../utils/Navigation'
import { getFriends } from '../../api/api'
import { bindKeyboard } from 'react-swipeable-views-utils'

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews)

export default function LoggedInPage({ setIsLoggedIn }) {
  const [slideIndex, setSlideIndex] = useState(1)
  const [friends, setFriends] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(true)
  const [requestCount, setReuqestCount] = useState(0)

  useEffect(_ => {
    getFriends().then(friends => {
      setFriends(friends)
      setLoadingFriends(false)
      fetchFriends()
    })
  }, [])

  const fetchFriends = _ => {
    console.log('fetching friends')
    refreshContacts()
    setTimeout(fetchFriends, 1000 * 10)
  }

  const refreshContacts = _ => {
    getFriends().then(setFriends)
  }
  return (
    <>
      <BindKeyboardSwipeableViews
        containerStyle={{ maxHeight: '100%' }}
        resistance
        onChangeIndex={index => setSlideIndex(index)}
        index={slideIndex}
      >
        <ContactPage
          setReuqestCount={setReuqestCount}
          onRequestAccepted={refreshContacts}
        />
        <FriendsPage friends={friends} isLoading={loadingFriends} />
        <SettingsPage setIsLoggedIn={setIsLoggedIn} slideIndex={slideIndex} />
      </BindKeyboardSwipeableViews>

      <Navigation slideIndex={slideIndex}>
        {withNavButtonStyled(0, 'fa fa-search', requestCount)}
        {withNavButtonStyled(1, 'fa fa-users')}
        {withNavButtonStyled(2, 'fa fa-cogs')}
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
