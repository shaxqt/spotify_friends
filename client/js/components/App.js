import React, { useState, useEffect } from 'react'
import Button from './form/Button'
import { setCookie, getCookie } from '../utils/cookies'

const TestPage = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [test, setTest] = useState('')
  const [cookies, setCookies] = useState('')

  useEffect(() => {
    const token = getCookie('spofiy_friends_token')
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
        setIsLoading(false)
        setIsLoggedIn(json.success)
      })
  }

  function login() {
    window.location = 'http://localhost:3333/auth/login'
  }
}

export default TestPage
