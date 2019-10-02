import React from 'react'
import GlobalStyle from '../utils/GlobalStyles'

export default function Wrapper(storyFn) {
  return (
    <>
      <GlobalStyle />
      <div
        style={{
          display: 'grid',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#222',
          padding: '50px'
        }}
      >
        {storyFn()}
      </div>
    </>
  )
}
