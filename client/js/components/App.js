import React, { useState, useEffect } from 'react'
import { getCookie, setCookie, eraseCookie } from '../utils/cookies'
import { verifyToken } from '../api/auth'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TestPage from './pages/TestPage'
import Main from '../components/utils/Main'
import Nav from '../components/utils/Nav'
import Header from '../components/utils/Header'

const App = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getCookie('spotify_friends_token')
    console.log('useEffect', token)
    verifyToken(token)
      .then(data => {
        if (data.success) {
          setCookie('spotify_friends_token', data.token, 30)
          setIsLoggedIn(true)
        } else {
          eraseCookie('spotify_friends_token')
        }
      })
      .catch(err => console.log(err))
      .finally(setIsLoading(false))
  }, [])

  return (
    <>
      <Header>Header</Header>
      <Main>{isLoggedIn ? <TestPage /> : <LoginPage />}</Main>
      <Nav></Nav>
    </>
  )
}

export default App
