import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import PropTypes from 'prop-types'

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
  const buttonClassName = isAddButtonActive
    ? 'fa fa-user-plus'
    : 'fa fa-user-times'
  const handleOnClick = event => {
    event.preventDefault()
    onClick()
  }
  return (
    <UserStyled isAddButtonActive={isAddButtonActive}>
      <GridStyled
        stretchHeight
        gap="10px"
        templateColumns="1fr 50px"
        alignItems="center"
      >
        <div>
          <h2>{display_name}</h2>
          <small>{contactInfo && contactInfo}</small>
        </div>
        {(isAddButtonActive || isRetractButtonActive) && (
          <i onClick={handleOnClick} className={buttonClassName}></i>
        )}
      </GridStyled>
    </UserStyled>
  )
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
