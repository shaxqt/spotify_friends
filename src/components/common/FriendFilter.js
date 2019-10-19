import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'

export default function FriendFilter({ friends }) {
  friends = [...friends, ...friends, ...friends]
  return (
    <FriendFilterStyled>
      {friends.map(friend => (
        <GridStyled justifyItems="center" gap="2px">
          <FriendImageStyled key={friend.id} img={friendGetImg(friend)} />
          <FriendNameStyled>{friend.display_name}</FriendNameStyled>
        </GridStyled>
      ))}
    </FriendFilterStyled>
  )
}

function friendGetImg(friend) {
  return friend.hasOwnProperty('images') &&
    Array.isArray(friend.images) &&
    friend.images.length > 0
    ? friend.images[0].url
    : ''
}

const FriendFilterStyled = styled.section`
  display: grid;
  grid-gap: 5px;
  grid-auto-flow: column;

  overflow-x: scroll;
`

const FriendNameStyled = styled.div`
  font-size: 10px;
`

const FriendImageStyled = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-color: #666;
  background-image: ${props => props.img && `url(${props.img})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
`
