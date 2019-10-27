import React from 'react'
import styled from 'styled-components'
import { getTopSongData } from '../../utils/utils'
import GridStyled from '../utils/GridStyled'

export default function Song({
  song,
  togglePreview,
  isPlaying,
  noImage,
  onPlay
}) {
  const {
    song_title,
    song_artists,
    song_image_small,
    song_image_medium,
    names,
    preview_url,
    uri
  } = getTopSongData(song)

  return (
    <SongStyled onClick={handleOnPlay}>
      {noImage ? <div></div> : <ImgContainerStyled img={song_image_medium} />}
      <TextContentStyled alignContent="space-between">
        <h2>{song_title}</h2>
        <div>
          <div>{song_artists}</div>
          <small>{names}</small>
        </div>
      </TextContentStyled>
      {preview_url && (
        <IconStyled
          isPlaying={isPlaying}
          className={'fas fa-music'}
          onClick={handleOnPreview}
        ></IconStyled>
      )}
    </SongStyled>
  )
  function handleOnPreview(e) {
    e.preventDefault()
    togglePreview(preview_url)
  }
  function handleOnPlay(e) {
    e.preventDefault()
    onPlay(uri)
  }
}
const IconStyled = styled.i`
  height: 80px;
  color: ${({ isPlaying }) => (isPlaying ? '#1db954' : '#777')};

  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const ImgContainerStyled = styled.div`
  height: 80px;
  overflow: hidden;
  background-image: ${props => props.img && `url(${props.img})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`
const TextContentStyled = styled(GridStyled)`
  height: 80px;
  padding: 5px;
`
const SongStyled = styled.section`
  width: 100%;
  display: grid;
  grid-template-columns: 80px 1fr 50px;
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
`
