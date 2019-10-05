import React, { useState, useEffect } from 'react'
import Main from '../utils/Main'
import ContactCurrSong from '../common/ContactCurrSong'
import { postRequest } from '../../api/fetch'
import { findReplace } from '../../utils/utils'
import GridStyled from '../utils/GridStyled'

const HomePage = props => {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    getContacts()
  }, [])

  return (
    <Main>
      <GridStyled gap="20px">{renderContacts()}</GridStyled>
    </Main>
  )
  function renderContacts() {
    return contacts.map(contact => (
      <ContactCurrSong
        key={contact.id}
        contact={contact}
        onPlay={getHandleOnPlay(contact)}
      />
    ))
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
        postRequest(body, '/user/start_playback').then(res => console.log(res))
      }
    }
  }
  function getContacts() {
    postRequest({}, '/user/contacts').then(res => {
      if (res.success) {
        res.items.forEach(contact => getCurrSong(contact))
      }
    })
  }
  async function getCurrSong(contact) {
    try {
      const currSong = await postRequest(
        { userID: contact.id },
        '/user/curr_song'
      )
      if (currSong.success) {
        const mappedContact = { ...contact, currSong: currSong.items }
        setContacts(findReplace(contacts, contact, mappedContact))
        if (mappedContact.currSong && mappedContact.currSong.next_fetch_in_ms) {
          setTimeout(
            () => getCurrSong(mappedContact),
            mappedContact.currSong.next_fetch_in_ms
          )
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}

export default HomePage
