const requestLib = require('request')

const spotifyGetMe = access_token => {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + access_token },
      json: true
    }
    // use the access token to access the Spotify Web API
    requestLib.get(options, function(error, response, body) {
      if (error) {
        reject(error)
      } else if (body.error) {
        reject(body)
      }

      resolve(body)
    })
  })
}

module.exports = spotifyGetMe
/*
export function getTopTracks(access_token) {
  const options = {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true
  }
  // use the access token to access the Spotify Web API
  requestLib.get(options, function(error, response, body) {
    console.log('ANTWORT VON v1/me/top/tracks Request', body)
  })
}
export function getCurrPlayingSong(access_token) {
  const options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true
  }

  // use the access token to get curr playing song
  requestLib.get(options, function(error, response, body) {
    console.log('ANTWORT VON v1/me/player/currently-playing', body)
  })
}
 */
