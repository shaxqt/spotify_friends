import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import FixedStyled from '../utils/FixedStyled'

export default function Card({ contact, onPlay, onHeaderClick }) {
  return (
    <ContactCurrSongStyled>
      <BackgroundImageStyled img={getImage()} />
      <ContentStyled>
        <GridStyled stretchHeight alignContent="space-between">
          <GridStyled gap="10px">
            <h2 onClick={onHeaderClick}>{renderTitle()}</h2>
            <p>
              <strong>{contact.currSong && contact.currSong.album}</strong>
            </p>
            <p>{renderArtists()}</p>
          </GridStyled>

          <GridStyled autoFlow="column" gap="20px">
            <GridStyled alignItems="center">
              <i onClick={onPlay} className="fa fa-play-circle"></i>
            </GridStyled>
            <GridStyled alignItems="center">
              <small>{contact.currSong && contact.currSong.context_type}</small>
            </GridStyled>
            <GridStyled justifyItems="center" alignItems="center">
              <h3>{contact.display_name}</h3>
            </GridStyled>
          </GridStyled>
        </GridStyled>
      </ContentStyled>
    </ContactCurrSongStyled>
  )

  function renderTitle() {
    if (contact.currSong && contact.currSong.name) {
      return contact.currSong.name
    }
    return 'no song information ☹️'
  }
  function renderArtists() {
    if (contact.currSong && Array.isArray(contact.currSong.artists)) {
      return contact.currSong.artists.join(', ')
    }
  }
  function getImage() {
    if (contact.currSong && Array.isArray(contact.currSong.artists)) {
      return contact.currSong.images[0].url
    }
  }
}

const BackgroundImageStyled = styled(FixedStyled)`
  background-image: ${porps => porps.img && `url(${porps.img})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 20px;
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
const ContactCurrSongStyled = styled.section`
  min-height: 450px;
  height: 100%;
  max-width: 450px;
  min-width: 250px;
  padding: 20px;
  position: relative;
  overflow-x: scroll;
`

const ContentStyled = styled(FixedStyled)`
  padding: 20px;
  h2 {
    font-size: 24px;
    margin: 0;
    color: rgb(30, 215, 97);
  }
  p {
    margin: 0;
  }
  .fa-play-circle {
    color: rgb(30, 215, 97);
    font-size: 50px;
  }
`
