import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import { getTopTracks } from './api/spotify'
import LoginPage from './components/pages/LoginPage'
import ContactPage from './components/pages/ContactPage'
import Main from './components/utils/Main'
import Nav from './components/utils/Nav'
import Header from './components/utils/Header'
import GlobalStyles from './components/utils/GlobalStyles'
import { getContacts } from './api/api'

const App = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [topTracks, setTopTracks] = useState([])

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

      <Main bgColor="#222">
        {isLoading ? renderLoadingScreen() : renderMainPage()}
      </Main>
    </>
  )
  function showTopTracks() {
    getTopTracks(localStorage.getItem('spotify_friends_token'))
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  function showContacts() {
    getContacts(localStorage.getItem('spotify_friends_token'))
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  function renderLoadingScreen() {
    return <h3>loading...</h3>
  }
  function renderMainPage() {
    return isLoggedIn ? <ContactPage /> : <LoginPage />
  }
}

export default App
