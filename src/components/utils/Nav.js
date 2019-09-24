import React from 'react'
import styled from 'styled-components'

const Nav = ({ bgColor, children }) => {
  return (
    <NavStyled bgColor={bgColor}>
      <ul>
        <li>a</li>
        <li>b</li>
        <li>c</li>
        <li>d</li>
      </ul>
    </NavStyled>
  )
}
const NavStyled = styled.nav`
  background-color: green;
  & > ul {
    display: grid;
    grid-auto-flow: column;
    background-color: yellow;
    height: 100%;
    margin: 0;
    padding: 0;
    & > li {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid black;
    }
  }
`

export default Nav
