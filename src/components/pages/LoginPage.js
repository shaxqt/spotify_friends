import React from 'react'
import Button from '../form/Button'
import Main from '../utils/Main'
import Form from '../form/Form'

const backend = process.env.BACKEND || 'http://localhost:3333'

const LoginPage = props => {
  return (
    <Main>
      <Form paddingTop="200px">
        <Button
          onClick={() => {
            window.location = backend + '/auth/login'
          }}
          text="login"
        />
      </Form>
    </Main>
  )
}

export default LoginPage
