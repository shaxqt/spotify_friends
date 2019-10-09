import React from 'react'
import styled from 'styled-components'
import GridStyled from '../utils/GridStyled'
import PropTypes from 'prop-types'
import Button from '../form/Button'

ContactRequest.propTypes = {
  display_name: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired
}

export default function ContactRequest({ display_name, onAccept, onDeny }) {
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
        <h2>{display_name}</h2>
        <GridStyled gap="30px" templateColumns="1fr 1fr">
          <Button onClick={handleOnDeny} color="red" text="deny"></Button>
          <Button onClick={handleOnAccept} text="accept"></Button>
        </GridStyled>
      </GridStyled>
    </ContactRequestStyled>
  )
}

const ContactRequestStyled = styled.section`
  padding: 15px;
  border-radius: 15px;
  background-color: #333;
  & h2 {
    margin: 0;
  }
`
