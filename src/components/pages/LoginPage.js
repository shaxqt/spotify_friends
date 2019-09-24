import React from 'react'
import Button from '../form/Button'

const LoginPage = props => {
  return (
    <Button
      callback={() => (window.location = 'http://localhost:3333/auth/login')}
      text='login'
    />
  )
}

export default LoginPage
