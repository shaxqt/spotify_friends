import React, { useState, useEffect } from 'react'
import ContactPage from './ContactPage'
import FriendsPage from './FriendsPage'
import TopSongPage from './TopSongPage'
import SettingsPage from './SettingsPage'
import Navigation, { withNavLink } from '../utils/Navigation'
import useActiveAudio from '../../hooks/useActiveAudio'
import useFriends from '../../hooks/useFriends'
import LoadingSpinner from '../utils/LoadingSpinner'
import useCurrentUser from '../../hooks/useCurrentUser'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import useTopSongs from '../../hooks/useTopSongs'

export default function LoggedInPage({ setIsLoggedIn }) {
  const [requestCount, setRequestCount] = useState(0)
  const [activeAudio, togglePreview] = useActiveAudio()
  const [friends, playFriendsSong, loadingFriends] = useFriends()
  const [
    currentUser,
    updateDisplayName,
    updateUserImagePublic,
    loadingCurrentUser
  ] = useCurrentUser()
  const [timeFilter, setTimeFilter] = useState('short_term')
  const [topSongs, loadingTopSongs] = useTopSongs(timeFilter)

  return (
    <>
      {loadingCurrentUser || loadingFriends ? (
        <LoadingSpinner />
      ) : (
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
                  setTimeFilter={setTimeFilter}
                  topSongs={topSongs}
                  isLoading={loadingTopSongs}
                  timeFilter={timeFilter}
                  friends={[
                    { ...currentUser, display_name: 'you' },
                    ...friends
                  ]}
                  activeAudio={activeAudio}
                  togglePreview={togglePreview}
                />
              )}
            />
            <Route
              exact
              path="/settings"
              render={() => (
                <SettingsPage
                  setIsLoggedIn={setIsLoggedIn}
                  currentUser={currentUser}
                  updateDisplayName={updateDisplayName}
                  updateUserImagePublic={updateUserImagePublic}
                />
              )}
            />

            <Route
              exact
              path="/"
              render={() => (
                <FriendsPage
                  friends={friends}
                  playFriendsSong={playFriendsSong}
                  activeAudio={activeAudio}
                  togglePreview={togglePreview}
                />
              )}
            />
          </Switch>
          <Navigation>
            {withNavLink(
              '/contacts',
              'fa fa-search',
              'Find Friends',
              requestCount
            )}
            {withNavLink('/', 'fa fa-users', 'Currently Playing')}
            {withNavLink('/top-songs', 'fa fa-headphones', 'Top Songs')}
            {withNavLink('/settings', 'fa fa-cogs', 'Settings')}
          </Navigation>
        </BrowserRouter>
      )}
    </>
  )
}
