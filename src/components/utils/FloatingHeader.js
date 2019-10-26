import React from 'react'
import styled from 'styled-components'

export default function FloatingHeader({ height, show, children }) {
  return (
    <HeaderStyled height={height} show={show}>
      {children}
    </HeaderStyled>
  )
}

const HeaderStyled = styled.header`
  position: fixed;
  overflow-y: hidden;
  height: ${({ height }) => height};
  left: 0;
  right: 0;
  top: ${({ show, height }) => (show ? '0' : '-' + height)};
  transition: top 0.3s ease-in-out;
`
