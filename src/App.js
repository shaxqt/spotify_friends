import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import LoginPage from './components/pages/LoginPage'
import LoggedInPage from './components/pages/LoggedInPage'
import GlobalStyles from './components/utils/GlobalStyles'
import SocketContext from './context/SocketContext'
import io from 'socket.io-client'
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const backend = process.env.BACKEND || 'http://localhost:3333'

const { spotify_friends_token } = localStorage
const socket = io(backend, {
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
      {isLoading ? renderLoadingScreen() : renderMainPage()}
    </>
  )

  function renderLoadingScreen() {
    return <h3>checking token...</h3>
  }
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

const AlertTemplateStyled = ({ message, options, close }) => {
  const style = {
    backgroundColor: '#151515',
    color: 'white',
    padding: '10px',
    textTransform: '',
    fontSize: '12px',
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 2px 2px rgba(0, 0, 0, 0.03)',
    fontFamily: 'inherit',
    width: '350px'
  }
  return (
    <AlertTemplate
      style={style}
      message={message}
      options={options}
      close={close}
    />
  )
}
