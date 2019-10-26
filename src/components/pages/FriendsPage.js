import React, { useEffect, useState } from 'react'
import Main from '../utils/Main'
import FriendsCurrSong from '../common/FriendsCurrSong'
import { putRequest } from '../../api/fetch'
import GridStyled from '../utils/GridStyled'
import { useAlert } from 'react-alert'
import { getFriends } from '../../api/api'
import SocketContext from '../../context/SocketContext'
import LoadingSpinner from '../utils/LoadingSpinner'

export default function FriendsPage({ togglePreview, activeAudio }) {
  const [friends, setFriends] = useState([])
  const [newSong, setNewSong] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const alert = useAlert()
  const socket = React.useContext(SocketContext)

  useEffect(
    _ => {
      getFriends().then(friends => {
        setFriends(friends)
        setIsLoading(false)
      })
      socket.on('update_friends', data => {
        console.log('updating your friends')
        getFriends().then(setFriends)
      })
      socket.on('newsong', data => {
        setNewSong(data)
      })
    },
    [socket]
  )
  useEffect(
    _ => {
      if (newSong['userID'] && newSong['currSong']) {
        const friendToReplace = friends.find(f => f.id === newSong['userID'])
        if (friendToReplace) {
          setFriends(
            friends.map(f =>
              f === friendToReplace ? { ...f, currSong: newSong.currSong } : f
            )
          )
        }
      }
    },
    [newSong]
  )

  return (
    <Main>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <GridStyled gap="20px" justifyItems="center">
          {renderFriends()}
        </GridStyled>
      )}
    </Main>
  )

  function renderFriends() {
    return friends.map(friend => (
      <FriendsCurrSong
        key={friend.id}
        friend={friend}
        onPlay={getHandleOnPlay(friend)}
        togglePreview={togglePreview}
        activeAudio={activeAudio}
      />
    ))
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
          body.uris = [friend.currSong.item.uri]
        }
        if (body['context_uri'] || body['uris']) {
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
