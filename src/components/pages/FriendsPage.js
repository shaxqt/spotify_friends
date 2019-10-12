import React from 'react'
import Main from '../utils/Main'
import FriendsCurrSong from '../common/FriendsCurrSong'
import { putRequest } from '../../api/fetch'
import GridStyled from '../utils/GridStyled'

export default function FriendsPage({ friends, isLoading }) {
  return (
    <Main>
      <GridStyled gap="20px" justifyItems="center">
        {isLoading ? <p>loading friends...</p> : renderFriends()}
      </GridStyled>
    </Main>
  )

  function renderFriends() {
    return friends.length > 0 ? (
      friends.map(friend => (
        <FriendsCurrSong
          key={friend.id}
          contact={friend}
          onPlay={getHandleOnPlay(friend)}
        />
      ))
    ) : (
      <p>no friends ☹️</p>
    )
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
