import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  bgColor: PropTypes.string,
  color: PropTypes.string
}

export default function Button({
  text,
  onClick,
  type = 'submit',
  bgColor = 'rgb(30, 215, 97)',
  color = '#eee'
}) {
  return (
    <ButtonStyled type={type} onClick={onClick} bgColor={bgColor} color={color}>
      <UnderlineStyled>{text}</UnderlineStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.button`
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
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
    border-bottom: solid 1px ${({ color }) => color};
    transform: scaleX(0);
    transition: transform 150ms ease-in-out;
  }
  &:hover:after {
    transform: scaleX(1);
  }
`
