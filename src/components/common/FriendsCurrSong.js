import React from 'react'
import styled from 'styled-components'
import FixedStyled from '../utils/FixedStyled'
import PropTypes from 'prop-types'
import BackgroundImageStyled from '../utils/BackgroundImageStyled'
import GridStyled from '../utils/GridStyled'
import { getSongData } from '../../utils/utils'

FriendsCurrSong.propType = {
  contact: PropTypes.objectOf('contact').isRequired,
  onPlay: PropTypes.func
}
export default function FriendsCurrSong({ friend, onPlay }) {
  const {
    display_name,
    song_image,
    song_title,
    song_arists,
    playing_type,
    timeFetched
  } = getSongData(friend)

  return (
    <FriendsCurrSongStyled>
      <BackgroundImageStyled img={song_image} />
      <ContentStyled>
        <GridStyled autoFlow="column" justifyContent="space-between">
          <div>
            <h2>{song_title}</h2>
            <h4>{song_arists}</h4>
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
          <h3>{display_name}</h3>
        </div>
      </ContentStyled>
    </FriendsCurrSongStyled>
  )
}

const FriendsCurrSongStyled = styled.section`
  height: 450px;
  width: 100%;
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
    align-items: flex-end;
    justify-content: space-between;
    &__left {
      display: grid;
      grid-auto-flow: column;
      grid-gap: 10px;
      align-items: center;
    }
  }

  .fa-play-circle {
    color: rgb(30, 215, 97);
    font-size: 50px;
  }
`
