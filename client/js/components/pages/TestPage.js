import React, { useState, useEffect } from 'react'
import Button from '../form/Button'
import Card from '../utils/Card'
import { getCookie, eraseCookie } from '../../utils/cookies'
import { verifyToken } from '../../api/auth'
import { getTopTracks, getMe, getCurrSong } from '../../api/spotify'

const TestPage = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [test, setTest] = useState('')
  const [cookies, setCookies] = useState('')
  const [tracks, setTracks] = useState([])
  const [song, setSong] = useState({})

  useEffect(() => {
    setCookies(document.cookie)
    const token = getCookie('spotify_friends_token')
    setToken(token)
    verifyUser(token)
    console.log(song)
  })
  return (
    <>
      <main>
        <h2>Seite lädt: {isLoading ? 'ja' : 'nein'}</h2>
        <h2>logged in: {isLoggedIn ? 'ja' : 'nein'}</h2>
        <h2>token: {token}</h2>
        <h3>me</h3>
        <p>{test}</p>
        <h3>cookies</h3>
        <p>{cookies}</p>
        <h3>song</h3>
        {renderSong()}
        <Button callback={() => getMe(token, setTest)} text='getMe' />
        <Button callback={() => verifyUser(token)} text='verify' />
        <Button callback={login} text='login' />
        <Button
          callback={() => getTopTracks(token, setTracks)}
          text='getTopTracks'
        />
        <Button
          callback={() => getCurrSong(token, setSong)}
          text='getCurrSong'
        />
        {renderTopTracks()}
      </main>
    </>
  )
  function verifyUser(token) {
    verifyToken(token)
      .then(data => {
        if (data.success) {
          setIsLoggedIn(true)
        } else {
          eraseCookie('spotify_friends_token')
        }
      })
      .catch(err => console.log(err))
      .finally(setIsLoading(false))
  }
  function renderSong() {
    if (song.item && song.item.album && song.item.artists) {
      return (
        <>
          <p> {song.item ? song.item.name : ''}</p>
          <p> {'Album: ' + song.item.album.name}</p>
          <p>
            {'Artists: ' + song.item.artists.map(artist => artist.name + ',')}
          </p>
        </>
      )
    }
  }

  function renderTopTracks() {
    if (Array.isArray(tracks)) {
      return tracks.map(track => (
        <Card
          key={track.id}
          title={track.name}
          text={track.artists.map(artist => artist.name + ', ')}
        />
      ))
    }
  }
  function login() {
    window.location = 'http://localhost:3333/auth/login'
  }
}

export default TestPage
