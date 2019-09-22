import React from 'react'
import styled from 'styled-components'

const Main = ({ bgColor, children }) => {
  return <MainStyled bgColor={bgColor}>{children}</MainStyled>
}
const MainStyled = styled.main`
  display: grid;
  grid-gap: 15px;
  overflow-y: scroll;
  padding: 20px;
  background-color: ${({ bgColor }) => bgColor || 'darkorchid'};
`

export default Main
