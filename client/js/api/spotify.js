import { callSpotifyAPI } from './api'

const backendHost = 'http://localhost:3333/v1'

const getMe = (token, callback) => {
  callSpotifyAPI(token, backendHost + '/me')
    .then(me => callback(JSON.stringify(me)))
    .catch(error => console.log(error))
}

const getTopTracks = (token, callback) => {
  callSpotifyAPI(token, backendHost + '/me/top/tracks')
    .then(tracks => {
      callback(tracks.items)
    })
    .catch(error => console.log('error'))
}
const getCurrSong = (token, callback) => {
  callSpotifyAPI(token, backendHost + '/me/player/currently-playing')
    .then(song => {
      callback(song)
    })
    .catch(error => console.log('error'))
}

export { getTopTracks, getMe, getCurrSong }
