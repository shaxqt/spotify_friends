import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import PropTypes from 'prop-types'
import Button from '../form/Button'

ContactRequest.propTypes = {
  display_name: PropTypes.string,
  onClick: PropTypes.func,
  isAddButtonActive: PropTypes.bool,
  isRetractButtonActive: PropTypes.bool,
  contactInfo: PropTypes.string
}

export default function ContactRequest({
  display_name,
  contactInfo,
  onAccept,
  onDeny
}) {
  return (
    <ContactRequestStyled>
      <GridStyled gap="15px">
        <h2>{display_name}</h2>
        {contactInfo && <small>{contactInfo}</small>}
        <GridStyled gap="10px" templateColumns="1fr 1fr">
          <Button onClick={handleOnAccept} bgColor="red" text="deny"></Button>
          <Button onClick={handleOnDeny} text="accept"></Button>
        </GridStyled>
      </GridStyled>
    </ContactRequestStyled>
  )

  function handleOnAccept(event) {
    event.preventDefault()
    onAccept()
  }
  function handleOnDeny(event) {
    event.preventDefault()
    onDeny()
  }
}

const ContactRequestStyled = styled.section`
  padding: 10px;
  border-radius: 15px;
  background-color: #333;
  & h2 {
    margin: 0;
  }
`
