import React, { createRef } from 'react'
import styled from 'styled-components'
import { getTopSongData } from '../../utils/utils'
import GridStyled from '../utils/GridStyled'
export default function Song({ onClick, song }) {
  const {
    song_title,
    song_artists,
    song_image,
    names,
    uri,
    preview_url
  } = getTopSongData(song)

  let buttonPressTimer
  let audio
  return (
    <SongStyled
      onTouchStart={handleButtonPress}
      onTouchEnd={handleButtonRelease}
      onMouseDown={handleButtonPress}
      onMouseUp={handleButtonRelease}
      onMouseLeave={handleButtonRelease}
    >
      <img src={song_image} />
      <TextContentStyled alignContent="space-between">
        <h2>{song_title}</h2>
        <div>
          <div>{song_artists}</div>
          <small>{names}</small>
        </div>
      </TextContentStyled>
    </SongStyled>
  )

  function handleButtonPress(e) {
    e.preventDefault()
    if (!audio) {
      audio = new Audio(preview_url)
    }
    buttonPressTimer = setTimeout(() => audio.play(), 400)
  }

  function handleButtonRelease(e) {
    e.preventDefault()
    if (audio) {
      audio.pause()
    }
    clearTimeout(buttonPressTimer)
  }
}
const TextContentStyled = styled(GridStyled)`
  padding: 5px;
`
const SongStyled = styled.section`
  display: flex;
  background-color: #333;
  height: 80px;
  overflow: hidden;
  font-size: 14px;
  border-radius: 20px;
  h2 {
    color: #1db954;
    margin: 0;
    font-size: 1rem;
  }
  small {
    font-size: 12px;
    color: #aaa;
  }
  img {
    height: 100%;
  }
`
