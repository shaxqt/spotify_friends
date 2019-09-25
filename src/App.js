import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import LoginPage from './components/pages/LoginPage'
import HomePage from './components/pages/HomePage'
import Main from './components/utils/Main'
import Nav from './components/utils/Nav'
import Header from './components/utils/Header'
import GlobalStyles from './components/utils/GlobalStyles'

const App = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrVerifyToken()
      .then(res => {
        if (res) {
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      })
      .catch(err => setIsLoggedIn(false))
      .finally(() => setIsLoading(false))
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
    return isLoggedIn ? <HomePage /> : <LoginPage />
  }
}

export default App
