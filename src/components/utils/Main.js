import React from 'react'
import styled from 'styled-components'

const Main = ({ bgColor, children }) => {
  return <MainStyled bgColor={bgColor}>{children}</MainStyled>
}
const MainStyled = styled.main`
  display: grid;
  grid-template-rows: min-content;
  grid-gap: 15px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: wrap;
  padding: 20px;
  background-color: ${({ bgColor }) => bgColor || '#eee'};
`

export default Main
