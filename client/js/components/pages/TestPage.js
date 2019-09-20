import React, { useState } from 'react'
import Button from '../form/Button'
export default function TestPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginResponse, setLoginResponse] = useState('')
  return (
    <>
      <Button
        text="Login"
        callback={() => (window.location = 'http://localhost:3333/auth/login')}
      />
      <LoggedInInfo />
    </>
  )
  function LoggedInInfo() {
    return <div>{loginResponse}</div>
  }
}
