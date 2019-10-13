import React from 'react'
import styled from 'styled-components'
import FixedStyled from '../utils/FixedStyled'
import PropTypes from 'prop-types'
import BackgroundImageStyled from '../utils/BackgroundImageStyled'

FriendsCurrSong.propType = {
  contact: PropTypes.objectOf('contact').isRequired,
  onPlay: PropTypes.func
}

export default function FriendsCurrSong({ contact, onPlay }) {
  const title =
    contact.currSong && contact.currSong.name
      ? contact.currSong.name
      : 'no song information ☹️'
  const artists =
    contact.currSong && Array.isArray(contact.currSong.artists)
      ? contact.currSong.artists.join(', ')
      : ''
  const imageUrl =
    contact.currSong && Array.isArray(contact.currSong.images)
      ? contact.currSong.images[0].url
      : ''
  return (
    <FriendsCurrSongStyled>
      <BackgroundImageStyled img={imageUrl} />
      <ContentStyled>
        <div>
          <h2>{title}</h2>
          <h4>{artists}</h4>
        </div>
        <div className="bottom">
          <i onClick={onPlay} className="fa fa-play-circle"></i>
          <h3>{contact.display_name}</h3>
        </div>
      </ContentStyled>
    </FriendsCurrSongStyled>
  )
}

const FriendsCurrSongStyled = styled.section`
  height: 450px;
  width: 100%;
  max-width: 450px;
  position: relative;
`

const ContentStyled = styled(FixedStyled)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  h2 {
    margin: 0;
    font-size: 24px;
    color: rgb(30, 215, 97);
  }
  h3 {
    margin: 0;
    color: white;
    font-size: 24px;
  }
  h4 {
    margin: 0;
    margin-top: 10px;
    font-size: 18px;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fa-play-circle {
    color: rgb(30, 215, 97);
    font-size: 50px;
  }
`
