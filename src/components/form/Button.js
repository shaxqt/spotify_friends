import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  color: PropTypes.string,
  fillColor: PropTypes.bool
}
Button.defaultProps = {
  type: 'submit',
  color: 'rgb(30, 215, 97)',
  fillColor: true
}
export default function Button({
  text,
  onClick,
  type = 'submit',
  color = 'rgb(30, 215, 97)',
  fillColor
}) {
  return (
    <ButtonStyled
      fillColor={fillColor}
      type={type}
      onClick={onClick}
      color={color}
    >
      <UnderlineStyled>{text}</UnderlineStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.button`
  border: ${({ fillColor, color }) =>
    fillColor ? 'none' : '2px solid ' + color};
  color: ${({ fillColor, color }) => (fillColor ? '#eee' : color)};
  background-color: ${({ fillColor, color }) =>
    fillColor ? color : 'transparent'};
  font-weight: bold;
  outline: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
`

const UnderlineStyled = styled.span`
  position: relative;
  display: inline-block;
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
