import React from 'react'
import styled from 'styled-components'

export default function Button({ text, callback }) {
  return <ButtonStyled onClick={callback}>{text}</ButtonStyled>
}

const ButtonStyled = styled.button`
  background-color: #ccc;
  border: 1px solid #333;
  height: 40px;
`
