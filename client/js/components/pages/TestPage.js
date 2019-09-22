import React, { useState, useEffect } from 'react'
import Button from './form/Button'
import { getCookie, eraseCookie } from '../utils/cookies'

const TestPage = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [test, setTest] = useState('')
  const [cookies, setCookies] = useState('')

  useEffect(() => {
    setCookies(document.cookie)
    const token = getCookie('spotify_friends_token')
    setToken(token)
    if (token) {
      verifyToken(token)
    } else {
      setIsLoading(false)
    }
  })
  return (
    <>
      <h2>Seite lädt: {isLoading ? 'ja' : 'nein'}</h2>
      <h2>logged in: {isLoggedIn ? 'ja' : 'nein'}</h2>
      <h2>token: {token}</h2>
      <p>{test}</p>
      <p>{cookies}</p>
      <Button callback={() => verifyToken(token)} text='verify' />
      <Button callback={login} text='login' />
    </>
  )
  function verifyToken(token) {
    fetch('http://localhost:3333/auth/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: token })
    })
      .then(res => res.json())
      .then(json => {
        if (!json.success) {
          eraseCookie('spotify_friends_token')
        }
        setIsLoading(false)
        setIsLoggedIn(json.success)
        console.log(token + ' verified: ' + json.success)
      })
  }

  function login() {
    window.location = 'http://localhost:3333/auth/login'
  }
}

export default TestPage
