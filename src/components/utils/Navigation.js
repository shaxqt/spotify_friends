import React, { useEffect } from 'react'
import styled from 'styled-components'
import GridStyled from './GridStyled'

export default function Navigtaion({ slideIndex, onClick }) {
  const buttons = [
    <i className="fa fa-search"></i>,
    <i className="fa fa-users"></i>
    /*<i className="fa fa-cogs"></i>*/
  ]
  useEffect(() => {
    console.log('useEffect', slideIndex)
  }, [slideIndex])

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
          console.log('hi', index, slideIndex)
          onClick(index)
        }}
      >
        {button}
      </NavButtonStyled>
    ))
  }
}

const NavStyled = styled(GridStyled)`
  background-color: #222;
  border-top: 1px solid #555;
`
const NavButtonStyled = styled(GridStyled)`
  color: ${({ activeSlide }) => (activeSlide ? 'rgb(30, 215, 97)' : '#555')};
  font-size: ${({ activeSlide }) => (activeSlide ? '25px' : '22px')};
  transition: ease-in-out 0.1s;
`
