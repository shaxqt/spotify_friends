import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import PropTypes from 'prop-types'
import { redirectTo } from '@reach/router'

User.propTypes = {
  display_name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isAddButtonActive: PropTypes.bool,
  isRetractButtonActive: PropTypes.bool,
  contactInfo: PropTypes.string
}

export default function User({
  display_name,
  onClick,
  isAddButtonActive,
  isRetractButtonActive,
  contactInfo
}) {
  return (
    <UserStyled isAddButtonActive={isAddButtonActive}>
      <GridStyled
        stretchHeight
        gap="10px"
        templateColumns="1fr 50px"
        alignItems="center"
      >
        <div style={{ minHeight: '50px' }}>
          <h2>{display_name}</h2>
          <small>{contactInfo && contactInfo}</small>
        </div>
        {renderButton()}
      </GridStyled>
    </UserStyled>
  )
  function renderButton() {
    if (isAddButtonActive) {
      return <i onClick={handleOnClick} className="fa fa-user-plus"></i>
    } else if (isRetractButtonActive) {
      return <i onClick={handleOnClick} className="fa fa-user-times"></i>
    } else {
      return <i></i>
    }
  }
  function handleOnClick(event) {
    event.preventDefault()
    onClick()
  }
}

const UserStyled = styled.section`
  padding: 15px;
  border-radius: 15px;
  background-color: #333;
  & h2 {
    margin: 0;
  }
  & i {
    color: ${({ isAddButtonActive }) =>
      isAddButtonActive ? 'rgb(30, 215, 97)' : '#777'};
    font-size: 40px;
  }
`
