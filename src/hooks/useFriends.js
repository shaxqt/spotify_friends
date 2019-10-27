import { useCallback, useState, useContext, useEffect, useRef } from 'react'
import { getFriends } from '../api/api'
import SocketContext from '../context/SocketContext'
import { putRequest } from '../api/fetch'
import { useAlert } from 'react-alert'

/*
 * this hook return an array of all friends, including their current playing song.
 * Sets up a Socket-Listener for new song data to update the friends-state.
 * also returns a function to set playback to the current song and a loading-state
 */
export default function useFriends() {
  const socket = useContext(SocketContext)
  const [friends, setFriends] = useState([])
  const alert = useAlert()

  const [isLoading, setIsLoading] = useState(true)
  const friendsRef = useRef([])

  const playFriendsSong = useCallback(async friend => {
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
  })

  useEffect(
    _ => {
      getFriends().then(friends => {
        friendsRef.current = friends
        setFriends(friends)
        setIsLoading(false)
      })

      socket.on('newsong', newSong => {
        if (
          newSong['userID'] &&
          newSong['currSong'] &&
          Array.isArray(friendsRef.current) &&
          friendsRef.current.length > 0
        ) {
          const friendToReplace = friendsRef.current.find(
            f => f.id === newSong['userID']
          )
          if (friendToReplace) {
            setFriends(
              friendsRef.current.map(f =>
                f === friendToReplace ? { ...f, currSong: newSong.currSong } : f
              )
            )
          }
        }
      })
    },
    [socket]
  )
  return [friends, playFriendsSong, isLoading]
}
