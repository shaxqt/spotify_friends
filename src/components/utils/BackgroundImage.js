import React from 'react'
import styled from 'styled-components'

export default function BackgroundImage({
  children,
  img,
  height,
  borderRadius
}) {
  return (
    <FriendsCurrSongStyled height={height}>
      <BackgroundImageStyled img={img} borderRadius={borderRadius} />
      <ContentStyled>{children}</ContentStyled>
    </FriendsCurrSongStyled>
  )
}
const ContentStyled = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`
const FriendsCurrSongStyled = styled.section`
  height: ${({ height }) => (height ? height : '450px')};
  width: 100%;
  position: relative;
`

const BackgroundImageStyled = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-image: ${props => props.img && `url(${props.img})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: ${({ borderRadius }) =>
    borderRadius ? borderRadius : '20px'};
  overflow: hidden;
  &:after {
    content: '';
    background: linear-gradient(
      hsl(0, 0%, 0%) 0%,
      hsla(0, 0%, 0%, 0.82) 10%,
      hsla(0, 0%, 0%, 0.74) 15%,
      hsla(0, 0%, 0%, 0.64) 20%,
      hsla(0, 0%, 0%, 0.53) 25%,
      hsla(0, 0%, 0%, 0.38) 40%,
      hsla(0, 0%, 0%, 0.25) 50%,
      hsla(0, 0%, 0%, 0.2) 60%,
      hsla(0, 0%, 0%, 0.25) 75%,
      hsla(0, 0%, 0%, 0.3) 80%,
      hsla(0, 0%, 0%, 0.6) 85%,
      hsla(0, 0%, 0%, 0.8) 90%,
      hsl(0, 0%, 0%) 100%
    );
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    mix-blend-mode: normal;
  }
`
