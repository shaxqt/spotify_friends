import React, { useState } from 'react'
import styled from 'styled-components'
import Input from '../form/Input'
import Button from '../form/Button'
import Form from '../form/Form'

const ContactPage = props => {
  const [search, setSearch] = useState('')
  return (
    <>
      <Form paddingTop="200px" onSubmit={onSubmit}>
        <Input label="search" value={search} onChange={handleOnChange}></Input>
        <Button text="search" />
      </Form>
    </>
  )

  function handleOnChange(event) {
    setSearch(event.currentTarget.value)
  }
  function onSubmit() {
    console.log('Suche: ' + search)
  }
}

export default ContactPage
