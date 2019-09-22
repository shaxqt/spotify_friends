import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import GlobalStyle from './components/pages/GlobalStyles'
import Button from './components/form/Button'
ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  window.app
)
