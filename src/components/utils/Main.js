import React from 'react'
import styled from 'styled-components'

const Main = ({ bgColor, children, noScroll }) => {
  return (
    <MainStyled noScroll={noScroll} bgColor={bgColor}>
      <MainContainer noScroll={noScroll}>{children}</MainContainer>
    </MainStyled>
  )
}
const MainStyled = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: hidden;
  background-color: ${({ bgColor }) => bgColor || '#222'};
`
const MainContainer = styled.section`
  width: 100%;
  max-width: 450px;
  @media (min-width: 768px) {
    max-width: 600px;
  }
  min-width: 250px;
  margin: 0 auto;
  padding: ${({ noScroll }) => (noScroll ? '0 20px' : '20px')};
  overflow-y: ${({ noScroll }) => (noScroll ? 'hidden' : 'scroll')};
  height: 100%;
`

export default Main
