import React from 'react'
import styled from 'styled-components'
import GridStyled from './GridStyled'

export default function Navigtaion({ children }) {
  return (
    <NavStyled autoFlow="column" as="nav">
      {children}
    </NavStyled>
  )
}

const NavStyled = styled(GridStyled)`
  border-top: 1px solid #555;
`
