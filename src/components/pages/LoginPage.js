import React from 'react'
import Button from '../form/Button'

const LoginPage = props => {
  return (
    <Button
      onClick={() => {
        console.log('moin')
        window.location = '/auth/login'
      }}
      text="login"
    />
  )
}

export default LoginPage
