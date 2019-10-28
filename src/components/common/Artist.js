import React from 'react'
import styled from 'styled-components'
import { getTopArtistData } from '../../utils/utils'
import GridStyled from '../utils/GridStyled'

export default function Song({ top, onPlay }) {
  const { image, name, genres, names, uri } = getTopArtistData(top)
  return (
    <ArtistStyled>
      {image ? <ImgContainerStyled img={image} /> : <div></div>}
      <TextContentStyled alignContent="space-between">
        <h2>{name}</h2>
        <div>
          <div>{genres}</div>
          <small>{names}</small>
        </div>
      </TextContentStyled>
      {uri && (
        <IconStyled
          className={'fas fa-play-circle'}
          onClick={handleOnPlay}
        ></IconStyled>
      )}
    </ArtistStyled>
  )

  function handleOnPlay(e) {
    e.preventDefault()
    onPlay(uri)
  }
}
const IconStyled = styled.i`
  height: 80px;
  font-size: 30px;
  color: #1db954;
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
  font-size: 12px;
`
const ArtistStyled = styled.section`
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
