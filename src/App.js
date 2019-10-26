import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import LoginPage from './components/pages/LoginPage'
import LoggedInPage from './components/pages/LoggedInPage'
import GlobalStyles from './components/utils/GlobalStyles'
import SocketContext from './context/SocketContext'
import io from 'socket.io-client'
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplateStyled from './components/utils/AlertTemplate'
import LoadingSpinner from './components/utils/LoadingSpinner'
const spotify_friends_token = localStorage.getItem('spotify_friends_token')
const socketPort = process.env.REACT_APP_SOCKET_PORT || ''

if (spotify_friends_token != null) {
  console.log(
    'conntecting socket to: ' +
      socketPort +
      ' with token: ' +
      spotify_friends_token
  )
}
const socket = io(socketPort, {
  query: { spotify_friends_token },
  secure: true,
  rejectUnauthorized: false
})

export default function App(props) {
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
      {isLoading ? <LoadingSpinner /> : renderMainPage()}
    </>
  )

  function renderMainPage() {
    return isLoggedIn ? (
      <SocketContext.Provider value={socket}>
        <AlertProvider
          template={AlertTemplateStyled}
          timeout={3000}
          position={positions.TOP_CENTER}
        >
          <LoggedInPage setIsLoggedIn={setIsLoggedIn} />
        </AlertProvider>
      </SocketContext.Provider>
    ) : (
      <LoginPage />
    )
  }
}
