import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
}

export default function Button({ text, onClick, type = 'submit' }) {
  return (
    <ButtonStyled type={type} onClick={onClick}>
      <UnderlineStyled>{text}</UnderlineStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.button`
  background-color: rgb(30, 215, 97);
  color: #eee;
  outline: none;
  border: none;
  border-radius: 15px;
  padding: 8px 14px;
  font-size: 1rem;
`

const UnderlineStyled = styled.span`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    border-bottom: solid 1px white;
    transform: scaleX(0);
    transition: transform 150ms ease-in-out;
  }
  &:hover:after {
    transform: scaleX(1);
  }
`
