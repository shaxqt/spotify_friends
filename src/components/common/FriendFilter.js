import React from 'react'
import styled from 'styled-components'
import FriendFilterItem from '../common/FriendFilterItem'
export default function FriendFilter({ friends, activeFilters, toggleFilter }) {
  const isActive = friend => activeFilters.find(id => id === friend.id)
  return (
    <FriendFilterStyled>
      {friends.map(friend => (
        <FriendFilterItem
          key={friend.id}
          friend={friend}
          active={isActive(friend)}
          toggleFilter={_ => toggleFilter(friend.id)}
        />
      ))}
    </FriendFilterStyled>
  )
}

const FriendFilterStyled = styled.section`
  display: flex;
  overflow-x: scroll;
  padding: 10px 20px;
`
