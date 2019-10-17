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
export function findReplaceId(array, item, replace) {
  const index = array.indexOf(item)
  const newResult = [
    ...array.slice(0, index),
    replace,
    ...array.slice(index + 1)
  ]
  return newResult
}

export function getSongData(friend) {
  let display_name,
    song_title,
    song_arists,
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
  }
  return {
    display_name,
    song_image,
    song_title,
    song_arists,
    playing_type,
    timeFetched
  }
}
