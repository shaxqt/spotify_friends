import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

Form.propTypes = {
  onSubmit: PropTypes.func,
  paddingTop: PropTypes.string
}

export default function Form({ onSubmit, children, paddingTop }) {
  return (
    <FormStyled paddingTop={paddingTop} onSubmit={handleSubmit}>
      {children}
    </FormStyled>
  )

  function handleSubmit(event) {
    event.preventDefault()
    event.stopPropagation()
    onSubmit()
  }
}
const FormStyled = styled.form`
  display: grid;
  grid-gap: 15px;
  ${({ paddingTop }) => paddingTop && 'padding-top: ' + paddingTop + ';'}
`
