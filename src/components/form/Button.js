import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  color: PropTypes.string
}
Button.defaultProps = {
  type: 'submit',
  color: 'rgb(30, 215, 97)'
}
export default function Button({
  text,
  onClick,
  type = 'submit',
  color = 'rgb(30, 215, 97)'
}) {
  return (
    <ButtonStyled type={type} onClick={onClick} color={color}>
      <UnderlineStyled>{text}</UnderlineStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.button`
  border: 1px solid ${({ color }) => color};
  color: ${({ color }) => color};
  background-color: transparent;
  outline: none;
  border-radius: 15px;
  padding: 10px 20px;
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
    border-bottom: solid 1px ${({ color }) => color};
    transform: scaleX(0);
    transition: transform 150ms ease-in-out;
  }
  &:hover:after,
  *:focus > &:after {
    transform: scaleX(1);
  }
`
