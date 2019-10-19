import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Editable from '../form/Editable'
import { getCurrentUser, updateUserSettings, logout } from '../../api/api'
import Main from '../utils/Main'
import GridStyled from '../utils/GridStyled'
import Checkbox from '../form/Checkbox'
import Modal from '../utils/Modal'
import Button from '../form/Button'

export default function SettingsPage({ active, setIsLoggedIn }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(_ => {
    getCurrentUser().then(setCurrentUser)
  }, [])

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
              isEditable={active}
            />
            <Checkbox
              label="Show profile picture"
              info="This could make it easier for your friends to find you. Your friends can always see your picture"
              value={currentUser.isUserImagePublic}
              onChange={onChangeIsUserImagePublic}
            />

            <small>
              your username: <strong>{currentUser.id}</strong>
            </small>
            <Button
              color="#FF695B"
              maxWidth="100px"
              borderButton
              onClick={toggleModal}
              text="logout"
              noCaps
            />
            <Modal
              title="logging out on..."
              show={showModal}
              toggle={toggleModal}
            >
              <GridStyled gap="15px">
                <Button
                  key="1"
                  color="#FF695B"
                  borderButton
                  onClick={_ => handleLogout()}
                  text="this device"
                  noCaps
                ></Button>
                <Button
                  key="2"
                  color="#FF695B"
                  borderButton
                  onClick={_ => handleLogout(true)}
                  text="all devices"
                  noCaps
                ></Button>
              </GridStyled>
            </Modal>
          </>
        ) : (
          <p>could not load user data</p>
        )}
      </GridStyled>
    </Main>
  )

  async function handleLogout(allDevices = false) {
    await logout(allDevices)
      .then(_ => setIsLoggedIn(false))
      .catch(err => err)
  }
  function toggleModal() {
    setShowModal(!showModal)
  }

  async function onChangeIsUserImagePublic(isUserImagePublic) {
    try {
      if (isUserImagePublic !== currentUser.isUserImagePublic) {
        const res = await updateUserSettings({ isUserImagePublic })
        if (res.success) {
          setCurrentUser(res.item)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  async function onSubmitDisplayName(display_name) {
    try {
      if (display_name !== currentUser.display_name) {
        const res = await updateUserSettings({ display_name })
        if (res.success) {
          setCurrentUser(res.item)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

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
