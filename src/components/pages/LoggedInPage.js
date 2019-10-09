import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import ContactPage from './ContactPage'
import FriendsPage from './FriendsPage'
import Navigation from '../utils/Navigation'
import { getFriends } from '../../api/api'

export default function LoggedInPage(props) {
  const [slideIndex, setSlideIndex] = useState(1)
  const [friends, setFriends] = useState([])

  useEffect(_ => {
    getFriends().then(setFriends)
  }, [])

  const refreshContacts = _ => {
    getFriends().then(setFriends)
  }
  return (
    <>
      <SwipeableViews
        containerStyle={{ maxHeight: '100%' }}
        resistance
        onChangeIndex={index => setSlideIndex(index)}
        index={slideIndex}
      >
        <ContactPage onRequestAccepted={refreshContacts} />
        <FriendsPage friends={friends} />
      </SwipeableViews>
      <Navigation slideIndex={slideIndex} onClick={setSlideIndex} />
    </>
  )
}
