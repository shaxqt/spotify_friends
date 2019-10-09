import React from 'react'
import Button from '../form/Button'
import Main from '../utils/Main'
const LoginPage = props => {
  return (
    <Main>
      <Button
        onClick={() => {
          window.location = 'http://localhost:3333/auth/login'
        }}
        text="login"
      />
    </Main>
  )
}

export default LoginPage
