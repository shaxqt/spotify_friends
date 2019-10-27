import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import BackgroundImage from '../utils/BackgroundImage'
import GridStyled from '../utils/GridStyled'
import { getSongData } from '../../utils/utils'

FriendsCurrSong.propType = {
  contact: PropTypes.objectOf('contact').isRequired,
  onPlay: PropTypes.func
}
export default function FriendsCurrSong({
  friend,
  onPlay,
  togglePreview,
  activeAudio
}) {
  const {
    display_name,
    song_image,
    song_title,
    song_artists,
    playing_type,
    timeFetched,
    preview_url
  } = getSongData(friend)
  return (
    <BackgroundImage img={song_image}>
      <ContentStyled>
        <GridStyled autoFlow="column" justifyContent="space-between">
          <div>
            <h2>{song_title}</h2>
            <h4>{song_artists}</h4>
          </div>
          <small>{timeFetched}</small>
        </GridStyled>
        <div className="bottom">
          <div className="bottom__left">
            <i onClick={onPlay} className="fa fa-play-circle"></i>
            <div>
              <div>
                <small>listening to</small>
              </div>
              <div>
                <strong>{playing_type}</strong>
              </div>
            </div>
          </div>
          <div className="bottom__right">
            {preview_url && (
              <IconStyled
                isPlaying={
                  preview_url === activeAudio.preview_url &&
                  activeAudio.isPlaying
                }
                className={'fas fa-music'}
                onClick={_ => togglePreview(preview_url)}
              ></IconStyled>
            )}
            <h3>{display_name}</h3>
          </div>
        </div>
      </ContentStyled>
    </BackgroundImage>
  )
}
const IconStyled = styled.i`
  color: ${({ isPlaying }) => (isPlaying ? '#1db954' : '#aaa')};
  font-size: 30px;
`
const ContentStyled = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;

  & h2 {
    margin: 0;
    font-size: 24px;
    color: #1db954;
  }
  h3 {
    margin: 0;
    color: white;
  }
  h4 {
    margin: 0;
    margin-top: 10px;
    font-size: 18px;
  }
  .bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    &__left {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 10px;
      align-items: center;
    }
    &__right {
      display: grid;
      grid-gap: 5px;
      justify-items: end;
    }
  }

  .fa-play-circle {
    color: #1db954;
    font-size: 50px;
  }
`
