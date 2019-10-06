import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import ContactPage from './ContactPage'
import HomePage from './HomePage'
import Navigation from '../utils/Navigation'

export default function LoggedInPage(props) {
  const [slideIndex, setSlideIndex] = useState(1)
  return (
    <>
      <SwipeableViews
        containerStyle={{ maxHeight: '100%' }}
        resistance
        onChangeIndex={setSlideIndex}
        index={slideIndex}
      >
        <ContactPage />
        <HomePage />
      </SwipeableViews>
      <Navigation slideIndex={slideIndex} onClick={setSlideIndex} />
    </>
  )
}
