import React from 'react'
import Button from '../form/Button'
import Main from '../utils/Main'
const LoginPage = props => {
  return (
    <Main>
      <Button
        onClick={() => {
          window.location =
            window.location.protocol +
            '//' +
            window.location.hostname +
            ':3333/auth/login'
        }}
        text="login"
      />
    </Main>
  )
}

export default LoginPage
