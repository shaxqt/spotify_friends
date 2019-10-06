import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import LoginPage from './components/pages/LoginPage'
import LoggedInPage from './components/pages/LoggedInPage'
import Main from './components/utils/Main'
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
      {isLoading ? renderLoadingScreen() : renderMainPage()}
    </>
  )

  function renderLoadingScreen() {
    return <h3>loading...</h3>
  }
  function renderMainPage() {
    return isLoggedIn ? <LoggedInPage /> : <LoginPage />
  }
}

export default App
