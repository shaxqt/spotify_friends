import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import PropTypes from 'prop-types'
import Button from '../form/Button'

ContactRequest.propTypes = {
  display_name: PropTypes.string.isRequired,
  image: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired
}

export default function ContactRequest({
  display_name,
  image,
  onAccept,
  onDeny
}) {
  const handleOnAccept = event => {
    event.preventDefault()
    onAccept()
  }
  const handleOnDeny = event => {
    event.preventDefault()
    onDeny()
  }

  return (
    <ContactRequestStyled>
      <GridStyled gap="20px">
        <GridStyled justifyContent="space-between" autoFlow="column">
          <h2>{display_name}</h2>
          {renderImage(image)}
        </GridStyled>
        <GridStyled gap="30px" templateColumns="1fr 1fr">
          <Button onClick={handleOnDeny} color="red" text="deny"></Button>
          <Button onClick={handleOnAccept} text="accept"></Button>
        </GridStyled>
      </GridStyled>
    </ContactRequestStyled>
  )
}
function renderImage(image) {
  if (image && image !== '') {
    return <img src={image} alt="" />
  }
  return <div></div>
}

const ContactRequestStyled = styled.section`
  padding: 15px;
  border-radius: 15px;
  background-color: #333;
  & h2 {
    margin: 0;
  }
  & img {
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
`
