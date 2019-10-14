import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  color: PropTypes.string,
  borderButton: PropTypes.bool,
  noCaps: PropTypes.bool
}
Button.defaultProps = {
  type: 'submit',
  color: 'rgb(30, 215, 97)',
  borderButton: false,
  noCaps: false
}
export default function Button({
  text,
  onClick,
  type = 'submit',
  color = 'rgb(30, 215, 97)',
  borderButton,
  noCaps
}) {
  return (
    <ButtonStyled
      type={type}
      onClick={onClick}
      color={color}
      borderButton={borderButton}
      noCaps={noCaps}
    >
      <UnderlineStyled>{text}</UnderlineStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.button`
  border: ${({ borderButton, color }) =>
    borderButton ? '2px solid ' + color : 'none'};
  color: ${({ borderButton, color }) => (borderButton ? color : '#eee')};
  background-color: ${({ borderButton, color }) =>
    borderButton ? 'transparent' : color};
  font-weight: bold;
  outline: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  ${({ noCaps }) => !noCaps && 'text-transform: uppercase;'}
`

const UnderlineStyled = styled.span`
  position: relative;
  height: 20px;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    border-bottom: solid 2px ${({ color }) => color};
    transform: scaleX(0);
    transition: transform 150ms ease-in-out;
  }
  &:hover:after,
  *:focus > &:after {
    transform: scaleX(1);
  }
`
