import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import PropTypes from 'prop-types'

User.propTypes = {
  display_name: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(Object),
  onClick: PropTypes.func,
  isAddButtonActive: PropTypes.bool,
  isRetractButtonActive: PropTypes.bool,
  contactInfo: PropTypes.string
}

export default function User({
  display_name,
  images,
  onClick,
  isAddButtonActive,
  isRetractButtonActive,
  isAcceptButtonActive,
  contactInfo
}) {
  const buttonClassName =
    isAddButtonActive || isAcceptButtonActive
      ? 'fa fa-user-plus'
      : 'fa fa-user-times'
  const handleOnClick = event => {
    event.preventDefault()
    onClick()
  }
  const renderImage = _ => {
    if (Array.isArray(images) && images.length > 0 && images[0].url !== '') {
      return <img src={images[0].url} alt="" />
    } else {
      return <div></div>
    }
  }
  return (
    <UserStyled isAddButtonActive={isAddButtonActive}>
      <GridStyled
        stretchHeight
        gap="15px"
        templateColumns="60px 1fr 50px"
        justifyContent="space-between"
        alignItems="center"
      >
        {renderImage()}
        <div>
          <h2>{display_name}</h2>
          <small>{contactInfo && contactInfo}</small>
        </div>
        {(isAddButtonActive ||
          isRetractButtonActive ||
          isAcceptButtonActive) && (
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
    font-size: 20px;
    margin: 0;
  }
  & i {
    color: ${({ isAddButtonActive }) =>
      isAddButtonActive ? 'rgb(30, 215, 97)' : '#777'};
    font-size: 40px;
  }
  img {
    width: 60px;
    height: 60px;
    position: center;
    size: cover;
    border-radius: 50%;
  }
`
