import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Editable from '../form/Editable'
import { getCurrentUser, updateDisplayName } from '../../api/api'
import Main from '../utils/Main'
import GridStyled from '../utils/GridStyled'
import Checkbox from '../form/Checkbox'

export default function SettingsPage({ slideIndex }) {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(_ => {
    getCurrentUser().then(setCurrentUser)
  }, [])

  const onSubmitDisplayName = async display_name => {
    try {
      const newDisplayName = await updateDisplayName(display_name)
      setCurrentUser({ ...currentUser, display_name: newDisplayName })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Main>
      <GridStyled gap="30px">
        {currentUser ? (
          <>
            {renderImage(currentUser)}
            <Editable
              label="display name"
              value={currentUser.display_name}
              onSubmit={onSubmitDisplayName}
              isEditable={slideIndex === 2}
            />
            <Checkbox
              label="Show profile picture"
              info="This could make it easier for your friends to find you. Your friends can always see your picture"
            />

            <small>
              your username: <strong>{currentUser.id}</strong>
            </small>
          </>
        ) : (
          <p>could not load user data</p>
        )}
      </GridStyled>
    </Main>
  )
  function renderImage() {
    if (
      currentUser &&
      currentUser.images.length > 0 &&
      currentUser.images[0].url !== ''
    ) {
      return <UserImageStyled src={currentUser.images[0].url} alt="" />
    }
  }
}

const UserImageStyled = styled.img`
  margin: auto auto;
  object-fit: cover;
  border-radius: 50%;
  width: 200px;
  height: 200px;
`
