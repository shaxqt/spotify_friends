import React from 'react'
import styled from 'styled-components'
import GridStyled from './GridStyled'
import { NavLink } from 'react-router-dom'

export default function Navigtaion({ children }) {
  return (
    <NavStyled autoFlow="column" as="nav">
      {children}
    </NavStyled>
  )
}

export function withNavLink(linkTo, btnClass, count) {
  const activeStyle = { color: '#1DB954', fontSize: '25px' }
  return (
    <NavLinkStyled
      to={linkTo}
      exact
      activeClassName="active"
      activeStyle={activeStyle}
    >
      <i className={btnClass}> </i>
      {count > 0 && (
        <NavButtonInfoStyled>{count > 99 ? '*' : count}</NavButtonInfoStyled>
      )}
    </NavLinkStyled>
  )
}
const NavStyled = styled(GridStyled)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  border-top: 1px solid #555;
`
const NavLinkStyled = styled(NavLink)`
  display: flex;
  justify-content: center;
  text-decoration: none;
  align-items: center;
  background-color: #222;
  position: relative;
  border: none;
  outline: none;
  color: #555;
  font-size: 22px;
  transition: ease-in-out 0.1s;
`
const NavButtonInfoStyled = styled.div`
  color: #fff;
  font-size: 14px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 50%;
  transform: translateX(5px);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  background-color: #1db954;
`
