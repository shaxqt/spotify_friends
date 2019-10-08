import React from 'react'
import Main from '../utils/Main'
import ContactCurrSong from '../common/ContactCurrSong'
import { putRequest } from '../../api/fetch'
import GridStyled from '../utils/GridStyled'

const HomePage = ({ contacts }) => {
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
          onPlay={getHandleOnPlay(contact)}
        />
      ))
    }
    return <p>render sample card here</p>
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
