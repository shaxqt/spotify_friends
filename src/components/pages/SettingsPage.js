import React, { useState } from 'react'
import styled from 'styled-components'
import Editable from '../form/Editable'
import { logout } from '../../api/api'
import Main from '../utils/Main'
import GridStyled from '../utils/GridStyled'
import Checkbox from '../form/Checkbox'
import Modal from '../utils/Modal'
import Button from '../form/Button'
export default function SettingsPage({
  currentUser,
  updateDisplayName,
  updateUserImagePublic,
  active,
  setIsLoggedIn
}) {
  const [showModal, setShowModal] = useState(false)

  return (
    <Main>
      <GridStyled gap="30px">
        {currentUser ? (
          <>
            {renderImage(currentUser)}
            <Editable
              maxLength="25"
              label="display name"
              value={currentUser.display_name}
              onSubmit={updateDisplayName}
              isEditable={active}
            />
            <Checkbox
              label="Show profile picture"
              info="This could make it easier for your friends to find you. Your friends can always see your picture"
              value={currentUser.isUserImagePublic}
              onChange={updateUserImagePublic}
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

  function renderImage() {
    if (
      currentUser &&
      currentUser['images'] &&
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
