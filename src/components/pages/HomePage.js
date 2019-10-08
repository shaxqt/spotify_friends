import React, { useState, useEffect } from 'react'
import Main from '../utils/Main'
import ContactCurrSong from '../common/ContactCurrSong'
import { postRequest, putRequest } from '../../api/fetch'
import { findReplace } from '../../utils/utils'
import GridStyled from '../utils/GridStyled'

const HomePage = ({ onNoContacts }) => {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    getContacts().then(contacts => {
      if (Array.isArray(contacts) && contacts.length < 0) {
        onNoContacts()
      }
    })
  }, [])

  return (
    <Main>
      <GridStyled gap="20px">{renderContacts()}</GridStyled>
    </Main>
  )

  function renderContacts() {
    if (contacts.length > 0) {
      return contacts.map(contact => (
        <ContactCurrSong
          key={contact.id}
          contact={contact}
          onHeaderClick={() => updateContactsSong(contact)}
          onPlay={getHandleOnPlay(contact)}
        />
      ))
    }
    return <p>render sample card here</p>
  }

  async function getContacts() {
    let mappedContacts = []
    const res = await postRequest('/user/contacts')
    if (res.success && res.items) {
      for (const contact of res.items) {
        mappedContacts = [...mappedContacts, await contactMapCurrSong(contact)]
      }
    }
    setContacts(mappedContacts)
  }

  async function updateContactsSong(contact) {
    const updated = await contactMapCurrSong(contact)
    if (updated) {
      setContacts(findReplace(contacts, contact, updated))
    }
  }
  async function contactMapCurrSong(contact) {
    try {
      const currSong = await postRequest('/user/curr_song', {
        userID: contact.id
      })
      if (currSong.success) {
        return { ...contact, currSong: currSong.items }
      } else {
        return contact
      }
    } catch (err) {
      console.log(err)
    }
  }
  function getHandleOnPlay(contact) {
    return _ => {
      if (contact.currSong) {
        const {
          context_uri,
          context_type,
          currently_playing_type,
          position_ms,
          uri
        } = contact.currSong
        console.log(
          context_uri,
          context_type,
          currently_playing_type,
          position_ms,
          uri
        )
        let body = { context_uri }
        if (
          (context_type === 'playlist' || context_type === 'album') &&
          currently_playing_type === 'track'
        ) {
          body.offset = { uri }
          body.position_ms = position_ms
        }
        putRequest('/user/start_playback', body).then(res => console.log(res))
      }
    }
  }
}
export default HomePage
