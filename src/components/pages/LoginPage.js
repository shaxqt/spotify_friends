import React from 'react'
import Button from '../form/Button'
import Main from '../utils/Main'
import Form from '../form/Form'

const LoginPage = props => {
  return (
    <Main>
      <Form paddingTop="200px">
        <Button
          onClick={() => {
            window.location.pathname = '/auth/login'
          }}
          text="login"
        />
      </Form>
    </Main>
  )
}

export default LoginPage
