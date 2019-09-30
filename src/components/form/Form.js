import React from 'react'
import styled from 'styled-components'

export default function Form({ onSubmit, children, paddingTop }) {
  return (
    <FormStyled paddingTop={paddingTop} onSubmit={handleSubmit}>
      {children}
    </FormStyled>
  )

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit()
  }
}
const FormStyled = styled.form`
  display: grid;
  grid-gap: 15px;
  ${({ paddingTop }) => paddingTop && 'padding-top: ' + paddingTop + ';'}
`
