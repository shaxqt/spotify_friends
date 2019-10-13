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
          friend={friend}
          onPlay={getHandleOnPlay(friend)}
        />
      ))
    ) : (
      <p>no friends ☹️</p>
    )
  }
  function getHandleOnPlay(friend) {
    return _ => {
      if (friend.currSong) {
        const body = {
          position_ms: friend.currSong.progress_ms,
          offset: { uri: friend.currSong.item.uri }
        }
        // play album if user listens to artist
        if (friend.currSong.context.type === 'artist') {
          body.context_uri = friend.currSong.item.album.uri
        } else {
          // play context (playlist or album)
          body.context_uri = friend.currSong.context.uri
        }
        putRequest('/user/start_playback', body)
      }
    }
  }
}
