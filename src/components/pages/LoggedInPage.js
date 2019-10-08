import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import ContactPage from './ContactPage'
import HomePage from './HomePage'
import Navigation from '../utils/Navigation'
import { postRequest } from '../../api/fetch'

function useContacts(slideIndex) {
  const [contacts, setContacts] = useState([])

  useEffect(
    _ => {
      const getContacts = async _ => {
        console.log('getContacts called')
        const res = await postRequest('/user/contacts')
        if (res.items) {
          const contacts = res.items
          contactsSortByTimestamp(contacts)
          setContacts(res.items)
        }
      }

      const contactsSortByTimestamp = contacts => {
        contacts.sort((a, b) => {
          if (a.currSong) {
            if (b.currSong) {
              return a.currSong.timestamp - b.currSong.timestamp
            } else {
              return -1
            }
          } else {
            return 1
          }
        })
      }
      getContacts()
    },
    [slideIndex]
  )
  return contacts
}
export default function LoggedInPage(props) {
  const [slideIndex, setSlideIndex] = useState(1)

  const contacts = useContacts(slideIndex)
  return (
    <>
      <SwipeableViews
        containerStyle={{ maxHeight: '100%' }}
        resistance
        onChangeIndex={index => setSlideIndex(index)}
        index={slideIndex}
      >
        <ContactPage />
        <HomePage contacts={contacts} />
      </SwipeableViews>
      <Navigation slideIndex={slideIndex} onClick={setSlideIndex} />
    </>
  )
}
