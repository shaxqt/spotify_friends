import React from 'react'
import styled from 'styled-components'
import Headline from './Headline'

const Card = ({ title, text, icon, onClick, onContextMenu }) => {
  return (
    <CardStyled onClick={onClick}>
      <div>bild</div>
      <div>
        <Headline level='2'>{title}</Headline>
        <p>{text}</p>
      </div>
    </CardStyled>
  )
}

const CardStyled = styled.section`
  display: grid;
  grid-template-columns: 50px auto;
  align-items: center;
  border: 1px solid green;
`

export default Card
