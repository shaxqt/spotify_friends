import React from 'react'
import styled from 'styled-components'

const Header = ({ children }) => {
  return <HeaderStyled>{children}</HeaderStyled>
}

const HeaderStyled = styled.header`
  background-color: ${({ bgColor }) => bgColor};
`
export default Header
