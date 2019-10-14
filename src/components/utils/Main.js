import React from 'react'
import styled from 'styled-components'

const Main = ({ bgColor, children }) => {
  return <MainStyled bgColor={bgColor}>{children}</MainStyled>
}
const MainStyled = styled.main`
  width: 100%;
  padding: 20px;
  background-color: ${({ bgColor }) => bgColor || '#222'};
  max-width: 450px;
  min-width: 250px;
  margin: 0 auto;
`

export default Main
