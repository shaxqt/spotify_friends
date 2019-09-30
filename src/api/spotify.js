import { postRequest } from './fetch'

const backendHost = 'http://localhost:3333/v1'

const getMe = (token, callback) => {
  postRequest(token, backendHost + '/me')
    .then(me => callback(JSON.stringify(me)))
    .catch(error => console.log(error))
}

const getTopTracks = token => {
  return new Promise((resolve, reject) => {
    console.log('getTopTracks', token)
    postRequest(token, backendHost + '/me/top/tracks')
      .then(tracks => resolve(tracks.items))
      .catch(error => reject(error))
  })
}
const getCurrSong = (token, callback) => {
  postRequest(token, backendHost + '/me/player/currently-playing')
    .then(song => {
      callback(song)
    })
    .catch(error => console.log('error'))
}

export { getTopTracks, getMe, getCurrSong }
