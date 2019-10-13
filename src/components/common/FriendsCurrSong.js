import React from 'react'
import styled from 'styled-components'
import FixedStyled from '../utils/FixedStyled'
import PropTypes from 'prop-types'
import BackgroundImageStyled from '../utils/BackgroundImageStyled'

FriendsCurrSong.propType = {
  contact: PropTypes.objectOf('contact').isRequired,
  onPlay: PropTypes.func
}
export default function FriendsCurrSong({ friend, onPlay }) {
  const { display_name, song_image, song_title, song_arists } = getSongData(
    friend
  )

  return (
    <FriendsCurrSongStyled>
      <BackgroundImageStyled img={song_image} />
      <ContentStyled>
        <div>
          <h2>{song_title}</h2>
          <h4>{song_arists}</h4>
        </div>
        <div className="bottom">
          <i onClick={onPlay} className="fa fa-play-circle"></i>
          <h3>{display_name}</h3>
        </div>
      </ContentStyled>
    </FriendsCurrSongStyled>
  )
}

function getSongData(friend) {
  let display_name, song_title, song_arists, song_image
  if (friend) {
    display_name = friend.display_name
    if (friend.currSong && friend.currSong.item) {
      song_title = friend.currSong.item.name
      song_arists = friend.currSong.item.artists
        .map(artist => artist.name)
        .join(', ')
      if (friend.currSong.item.album.images.length > 0) {
        song_image = friend.currSong.item.album.images[0].url
      }
    } else {
      song_title = 'no song information ☹️'
    }
  }
  return { display_name, song_image, song_title, song_arists }
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
    align-items: center;
    justify-content: space-between;
  }
  .fa-play-circle {
    color: rgb(30, 215, 97);
    font-size: 50px;
  }
`
