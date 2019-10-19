import moment from 'moment'
export function findRemove(array, item) {
  const index = array.indexOf(item)
  const newResult = [...array.slice(0, index), ...array.slice(index + 1)]
  return newResult
}

export function findReplace(array, item, replace) {
  const index = array.indexOf(item)
  const newResult = [
    ...array.slice(0, index),
    replace,
    ...array.slice(index + 1)
  ]
  return newResult
}
export function getTopSongData(topSong) {
  let ret = {}

  const songData = getSpotifySongItemData(topSong.song)
  ret = { ...songData }
  ret.names = topSong.friends.map(f => f.display_name).join(', ')

  return ret
}
export function getSongData(friend) {
  let display_name,
    song_title,
    song_artists,
    song_image,
    playing_type,
    timeFetched
  if (friend) {
    timeFetched = moment(friend.currSong.timestamp).fromNow()
    display_name = friend.display_name
    if (friend.currSong) {
      if (friend.currSong.context) {
        playing_type = friend.currSong.context.type
        if (friend.currSong.context.type === 'album') {
          playing_type = 'album'
          if (friend.currSong.item.album.album_type === 'single') {
            playing_type = 'single'
          }
          playing_type += ': ' + friend.currSong.item.album.name
        }
      } else {
        playing_type = friend.currSong.currently_playing_type
      }
      if (friend.currSong.item) {
        const songData = getSpotifySongItemData(friend.currSong.item)
        song_title = songData.song_title
        song_artists = songData.song_artists
        song_image = songData.song_image
      } else {
        song_title = 'no song information ☹️'
      }
    }
  }

  return {
    display_name,
    song_image,
    song_title,
    song_artists,
    playing_type,
    timeFetched
  }
}
function getSpotifySongItemData(item) {
  let ret = {}
  ret.song_title = item.name
  ret.song_artists = item.artists.map(artist => artist.name).join(', ')
  ret.uri = item.uri
  if (item.album.images.length > 0) {
    ret.song_image = item.album.images[0].url
  }
  ret.preview_url = item.preview_url
  return ret
}
