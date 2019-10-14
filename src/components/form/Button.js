import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  color: PropTypes.string,
  borderButton: PropTypes.bool,
  noCaps: PropTypes.bool,
  maxWidth: PropTypes.string
}
Button.defaultProps = {
  type: 'submit',
  color: '#1DB954',
  borderButton: false,
  noCaps: false
}
export default function Button({
  text,
  onClick,
  type = 'submit',
  color = '#1DB954',
  borderButton,
  noCaps,
  maxWidth
}) {
  return (
    <ButtonStyled
      type={type}
      onClick={onClick}
      color={color}
      borderButton={borderButton}
      noCaps={noCaps}
      maxWidth={maxWidth}
    >
      <UnderlineStyled>{text}</UnderlineStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.button`
  border: ${({ borderButton, color }) =>
    borderButton ? '1px solid ' + color : 'none'};
  color: ${({ borderButton, color }) => (borderButton ? color : 'inherit')};
  background-color: ${({ borderButton, color }) =>
    borderButton ? 'transparent' : color};
  -font-weight: bold;
  outline: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  height: 40px;
  display: flex;
  justify-content: center;
  ${({ noCaps }) => !noCaps && 'text-transform: uppercase;'}
  ${({ maxWidth }) =>
    maxWidth && 'max-width: ' + maxWidth + '; margin: 0 auto;'}
`

const UnderlineStyled = styled.span`
  position: relative;
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
