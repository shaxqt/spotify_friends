import React, { useState, useEffect } from 'react'
import { getOrVerifyToken } from './api/auth'
import { getTopTracks } from './api/spotify'
import LoginPage from './components/pages/LoginPage'
import HomePage from './components/pages/HomePage'
import Main from './components/utils/Main'
import Nav from './components/utils/Nav'
import Header from './components/utils/Header'
import GlobalStyles from './components/utils/GlobalStyles'
import { restElement } from '@babel/types'

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
      <Header>
        Header<button onClick={showTopTracks}>TRACKS</button>
      </Header>
      <Main>{isLoading ? renderLoadingScreen() : renderMainPage()}</Main>
      <Nav></Nav>
    </>
  )
  function showTopTracks() {
    getTopTracks(localStorage.getItem('spotify_friends_token'))
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  function renderLoadingScreen() {
    return <h3>loading...</h3>
  }
  function renderMainPage() {
    return isLoggedIn ? <HomePage /> : <LoginPage />
  }
}

export default App
