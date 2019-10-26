import React from 'react'
import styled from 'styled-components'
import GridStyled from './GridStyled'
import { NavLink } from 'react-router-dom'

export default function Navigation({ children }) {
  return (
    <NavStyled autoFlow="column" as="nav">
      {children}
    </NavStyled>
  )
}

export function withNavLink(linkTo, btnClass, label, count) {
  const activeStyle = { color: '#fff' }
  return (
    <NavLinkStyled to={linkTo} exact activeStyle={activeStyle}>
      <i className={btnClass}> </i>
      {label && <NavTextStyled>{label}</NavTextStyled>}
      {count > 0 && (
        <NavButtonInfoStyled>{count > 99 ? '*' : count}</NavButtonInfoStyled>
      )}
    </NavLinkStyled>
  )
}

const NavTextStyled = styled.div`
  font-size: 10px;
  margin-top: 2px;
  overflow: hidden;
  max-height: 12px;
`
const NavStyled = styled(GridStyled)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  border-top: 1px solid #111;
`
const NavLinkStyled = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
  align-items: center;
  background-color: #222;
  position: relative;
  border: none;
  outline: none;
  color: #555;
  font-size: 20px;
  transition: ease-in-out 0.1s;
  max-height: 50px;
  overflow: hidden;
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
