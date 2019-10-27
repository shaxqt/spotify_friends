import React from 'react'
import Main from '../utils/Main'
import FriendsCurrSong from '../common/FriendsCurrSong'
import GridStyled from '../utils/GridStyled'

export default function FriendsPage({
  friends,
  playFriendsSong,
  togglePreview,
  activeAudio
}) {
  return (
    <Main>
      <GridStyled gap="20px" justifyItems="center">
        {friends.map(friend => (
          <FriendsCurrSong
            key={friend.id}
            friend={friend}
            onPlay={() => playFriendsSong(friend)}
            togglePreview={togglePreview}
            activeAudio={activeAudio}
          />
        ))}
      </GridStyled>
    </Main>
  )
}
