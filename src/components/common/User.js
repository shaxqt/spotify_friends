import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'

export default function User({ user, onClick, isButtonActive, contactInfo }) {
  return (
    <UserStyled>
      <GridStyled templateColumns="1fr 35px" alignItems="center">
        <h2>{user.display_name}</h2>
        {isButtonActive ? (
          <i onClick={handleOnClick} className="fa fa-plus-circle"></i>
        ) : (
          <i></i>
        )}
      </GridStyled>
      <small>{contactInfo && contactInfo}</small>
    </UserStyled>
  )
  function handleOnClick(event) {
    event.preventDefault()
    if (isButtonActive) {
      onClick()
    }
  }
}

const UserStyled = styled.section`
  padding: 10px;
  border-radius: 15px;
  background-color: #333;
  & h2 {
    margin: 0;
  }
  & i {
    color: rgb(30, 215, 97);
    font-size: 35px;
  }
  & button {
    height: 35px;
    width: 35px;
  }
`
