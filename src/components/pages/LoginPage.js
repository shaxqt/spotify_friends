import React from 'react'
import Button from '../form/Button'
import Main from '../utils/Main'
import GridStyled from '../utils/GridStyled'
import styled from 'styled-components'
const LoginPage = props => {
  return (
    <MainFullWidth>
      <GridStyled>
        <Button
          onClick={() => {
            window.location = 'http://localhost:3333/auth/login'
          }}
          text="login"
        />
      </GridStyled>
    </MainFullWidth>
  )
}
const MainFullWidth = styled(Main)`
  width: 100%;
`

export default LoginPage
