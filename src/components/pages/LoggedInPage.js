import React, { useState, useEffect } from 'react'
import ContactPage from './ContactPage'
import FriendsPage from './FriendsPage'
import TopSongPage from './TopSongPage'
import SettingsPage from './SettingsPage'
import Navigation, { withNavLink } from '../utils/Navigation'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

export default function LoggedInPage({ setIsLoggedIn }) {
  const [requestCount, setRequestCount] = useState(0)
  const [activeAudio, setActiveAudio] = useState({
    audio: null,
    preview_url: '',
    isPlaying: false
  })

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/contacts"
            render={() => <ContactPage setRequestCount={setRequestCount} />}
          />
          <Route
            exact
            path="/top-songs"
            render={() => (
              <TopSongPage
                activeAudio={activeAudio}
                togglePreview={togglePreview}
              />
            )}
          />
          <Route
            exact
            path="/settings"
            render={() => <SettingsPage setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            exact
            path="/"
            render={() => (
              <FriendsPage
                activeAudio={activeAudio}
                togglePreview={togglePreview}
              />
            )}
          />
        </Switch>
        <Navigation>
          {withNavLink('/contacts', 'fa fa-search', requestCount)}
          {withNavLink('/', 'fa fa-users')}
          {withNavLink('/top-songs', 'fa fa-headphones')}
          {withNavLink('/settings', 'fa fa-cogs')}
        </Navigation>
      </BrowserRouter>
    </>
  )

  function togglePreview(preview_url) {
    console.log('TOGGLEPREVIEW', preview_url)
    if (preview_url != null && preview_url !== '') {
      if (activeAudio.preview_url === preview_url) {
        if (activeAudio.isPlaying) {
          activeAudio.audio.pause()
          setActiveAudio({ ...activeAudio, isPlaying: false })
        } else {
          activeAudio.audio.play()
          setActiveAudio({ ...activeAudio, isPlaying: true })
        }
      } else {
        if (activeAudio.audio) {
          activeAudio.audio.pause()
        }
        let audio = new Audio(preview_url)
        audio.play()
        setActiveAudio({ audio, isPlaying: true, preview_url })
      }
    }
  }
}
