import React from 'react'
import styled from 'styled-components'

const Main = ({ bgColor, children }) => {
  return <MainStyled bgColor={bgColor}>{children}</MainStyled>
}
const MainStyled = styled.main`
  padding: 20px;
  background-color: ${({ bgColor }) => bgColor || '#222'};
  max-width: 450px;
  margin: 0 auto;
`

export default Main
