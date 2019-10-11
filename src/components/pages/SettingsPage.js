import React, { useState, useEffect } from 'react'
import Editable from '../form/Editable'
import { getCurrentUser, updateDisplayName } from '../../api/api'
import Main from '../utils/Main'
import GridStyled from '../utils/GridStyled'

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(_ => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(err => console.log('ERROR', err))
  }, [])

  const onSubmitDisplayName = async display_name => {
    try {
      const newDisplayName = await updateDisplayName(display_name)
      console.log('got new displayname from db: ' + newDisplayName)
      setCurrentUser({ ...currentUser, display_name: newDisplayName })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <Main>
      {currentUser ? (
        <>
          <h1>Settings</h1>
          <GridStyled gap="20px">
            <Editable
              label="display name"
              value={currentUser.display_name}
              onSubmit={onSubmitDisplayName}
            />
            <small>
              your username: <strong>{currentUser.id}</strong>
            </small>
          </GridStyled>
        </>
      ) : (
        <p>could not load user data</p>
      )}
    </Main>
  )
}
