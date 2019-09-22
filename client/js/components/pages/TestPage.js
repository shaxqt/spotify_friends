import React, { useState, useEffect } from 'react'
import Button from '../form/Button'
import Card from '../utils/Card'
import { getCookie, eraseCookie } from '../../utils/cookies'
import { verifyToken } from '../../api/auth'
import { getTopTracks, getMe } from '../../api/spotify'

const TestPage = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [test, setTest] = useState('')
  const [cookies, setCookies] = useState('')
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    setCookies(document.cookie)
    const token = getCookie('spotify_friends_token')
    setToken(token)
    verifyUser(token)
  })
  return (
    <>
      <main>
        <h2>Seite lädt: {isLoading ? 'ja' : 'nein'}</h2>
        <h2>logged in: {isLoggedIn ? 'ja' : 'nein'}</h2>
        <h2>token: {token}</h2>
        <p>{test}</p>
        <p>{cookies}</p>
        <Button callback={() => getMe(token, setTest)} text='getMe' />
        <Button callback={() => verifyUser(token)} text='verify' />
        <Button callback={login} text='login' />
        <Button
          callback={() => getTopTracks(token, setTracks)}
          text='getTopTracks'
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

  function showTopTracks() {}
}

export default TestPage
