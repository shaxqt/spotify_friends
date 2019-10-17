import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import LoginPage from './components/pages/LoginPage'
import LoggedInPage from './components/pages/LoggedInPage'
import GlobalStyles from './components/utils/GlobalStyles'
import SocketContext from './context/SocketContext'
import io from 'socket.io-client'

const { spotify_friends_token } = localStorage
const socket = io('http://localhost:3333', {
  query: { spotify_friends_token },
  secure: true,
  rejectUnauthorized: false
})

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
    return <h3>checking token...</h3>
  }
  function renderMainPage() {
    return isLoggedIn ? (
      <SocketContext.Provider value={socket}>
        <LoggedInPage setIsLoggedIn={setIsLoggedIn} />
      </SocketContext.Provider>
    ) : (
      <LoginPage />
    )
  }
}

export default App
