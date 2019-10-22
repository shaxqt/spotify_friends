import React from 'react'
import styled from 'styled-components'
import { getShowenDisplayName } from '../../utils/utils'

export default function FriendFilterItem({ friend, toggleFilter, active }) {
  return (
    <FilterItemStyled>
      <FriendImageStyled
        active={active}
        img={friendGetImg(friend)}
        onClick={toggleFilter}
      />
      <FriendNameStyled active={active}>
        {getShowenDisplayName(friend.display_name)}
      </FriendNameStyled>
    </FilterItemStyled>
  )
  function friendGetImg(friend) {
    return friend.hasOwnProperty('images') &&
      Array.isArray(friend.images) &&
      friend.images.length > 0
      ? friend.images[0].url
      : ''
  }
}
const FilterItemStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
`

const FriendNameStyled = styled.div`
  margin-top: 2px;
  text-align: center;
  font-size: 10px;
  ${({ active }) => active && 'color: #1db954'}
`

const FriendImageStyled = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  ${({ active }) => active && 'border: 1px solid #1db954'}
  background-color: #666;
  background-image: ${props => props.img && `url(${props.img})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
`
