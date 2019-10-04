import React from 'react'
import Button from '../form/Button'

const LoginPage = props => {
  return (
    <Button
      onClick={() => {
        console.log(window.location.port)
        console.log(window.location.host)
        console.log(window.location.hostname)
        console.log(window.location.pathname)
        console.log(window.location.origin)
        window.location =
          window.location.protocol +
          '//' +
          window.location.hostname +
          ':3333/auth/login'
      }}
      text="login"
    />
  )
}

export default LoginPage
