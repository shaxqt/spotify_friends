import React, { useEffect } from 'react'
import styled from 'styled-components'
import GridStyled from './GridStyled'

export default function Navigtaion({ slideIndex, onClick }) {
  const buttons = [
    <i className="fa fa-search"></i>,
    <i className="fa fa-users"></i>,
    <i className="fa fa-cogs"></i>
  ]
  return (
    <NavStyled autoFlow="column" as="nav">
      {withNavButtonsStyled(buttons)}
    </NavStyled>
  )

  function withNavButtonsStyled(buttons) {
    return buttons.map((button, index) => (
      <NavButtonStyled
        key={index}
        alignItems="center"
        activeSlide={index === slideIndex}
        justifyContent="center"
        as="button"
        onClick={() => {
          onClick(index)
        }}
      >
        {button}
      </NavButtonStyled>
    ))
  }
}

const NavStyled = styled(GridStyled)`
  border-top: 1px solid #555;
`
const NavButtonStyled = styled(GridStyled)`
  background-color: #222;
  border: none;
  outline: none;
  color: ${({ activeSlide }) => (activeSlide ? 'rgb(30, 215, 97)' : '#555')};
  font-size: ${({ activeSlide }) => (activeSlide ? '25px' : '22px')};
  transition: ease-in-out 0.1s;
`
