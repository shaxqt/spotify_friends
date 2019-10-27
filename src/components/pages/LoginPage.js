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
            if (process.env.REACT_APP_BACKEND) {
              window.location = process.env.REACT_APP_BACKEND + '/auth/login'
            } else {
              window.location.pathname = '/auth/login'
            }
          }}
          text="login"
        />
      </Form>
    </Main>
  )
}

export default LoginPage
