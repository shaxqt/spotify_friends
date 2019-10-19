import React from 'react'
import styled from 'styled-components'

export default function Song({ title, friends, uri }) {
  return (
    <SongStyled>
      <div>{title}</div>
      <div>{friends.map(f => f.display_name).join(', ')}</div>
      <small>{uri}</small>
    </SongStyled>
  )
}

const SongStyled = styled.section`
  padding: 10px;
`
