import React, { useState, useEffect } from 'react'
import { getCookie, setCookie, eraseCookie } from './utils/cookies'
import { verifyToken } from './api/auth'
import LoginPage from './components/pages/LoginPage'
import HomePage from './components/pages/HomePage'
import TestPage from './components/pages/TestPage'
import Main from './components/utils/Main'
import Nav from './components/utils/Nav'
import Header from './components/utils/Header'
import GlobalStyles from './components/utils/GlobalStyles'

const App = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <>
      <GlobalStyles />
      <Header>Header</Header>
      <Main>{isLoading ? renderLoadingScreen() : renderMainPage()}</Main>
      <Nav></Nav>
    </>
  )
  function renderLoadingScreen() {
    return <h3>loading...</h3>
  }
  function renderMainPage() {
    return isLoggedIn ? <TestPage /> : <LoginPage />
  }

  function checkToken() {
    const token = getCookie('spotify_friends_token')
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
  }
}

export default App
