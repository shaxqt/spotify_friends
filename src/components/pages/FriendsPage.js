import React from 'react'
import Main from '../utils/Main'
import FriendsCurrSong from '../common/FriendsCurrSong'
import { putRequest } from '../../api/fetch'
import GridStyled from '../utils/GridStyled'
import { useAlert } from 'react-alert'

export default function FriendsPage({
  friends,
  isLoading,
  togglePreview,
  activeAudio
}) {
  const alert = useAlert()

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
          togglePreview={togglePreview}
          activeAudio={activeAudio}
        />
      ))
    ) : (
      <p>
        <span>no friends</span>
        <span style={{ marginLeft: '5px' }} role="img" aria-label="sad emoji">
          ☹️
        </span>
      </p>
    )
  }
  function getHandleOnPlay(friend) {
    return async _ => {
      if (friend['currSong']) {
        let body = {}
        if (friend.currSong['context']) {
          body = {
            position_ms: friend.currSong.progress_ms,
            offset: { uri: friend.currSong.item.uri }
          }
          // play album if user listens to artist
          if (
            friend['currSong'] &&
            friend.currSong['context'] &&
            friend.currSong.context['type'] === 'artist' &&
            friend.currSong['item'] &&
            friend.currSong.item['album'] &&
            friend.currSong.item.album['uri']
          ) {
            body.context_uri = friend.currSong.item.album.uri
          } else if (
            friend['currSong'] &&
            friend.currSong['context'] &&
            friend.currSong.context['uri']
          ) {
            // play context (playlist or album)
            body.context_uri = friend.currSong.context.uri
          }
        } else if (friend.currSong['item'] && friend.currSong.item['uri']) {
          // no context -> just play track
          body.context_uri = friend.currSong.item.uri
        }
        if (body['context_uri']) {
          const res = await putRequest('/user/start_playback', body)
          if (res && res.response) {
            if (res.response.error) {
              let message = res.response.error.message
              message =
                res.response.error.reason === 'NO_ACTIVE_DEVICE'
                  ? 'no active spotify device'
                  : message
              message =
                res.response.error.reason === 'PREMIUM_REQUIRED'
                  ? 'You need spotify premium account'
                  : message
              alert.error(message)
            } else {
              alert.show('playing on spotify...')
            }
          }
        }
      }
    }
  }
}
