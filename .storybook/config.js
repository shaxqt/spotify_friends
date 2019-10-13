import { configure, addDecorator } from '@storybook/react'
import React from 'react'
import GlobalStyle from '../src/components/utils/GlobalStyles'
import { withInfo } from '@storybook/addon-info'
import { withKnobs } from '@storybook/addon-knobs/react'

const wrapper = storyFn => {
  return (
    <div style={{ margin: '15px', marginTop: '50px' }}>
      <GlobalStyle />
      {storyFn()}
    </div>
  )
}

addDecorator(withInfo)
addDecorator(wrapper)
addDecorator(withKnobs)

const req = require.context('../src', true, /\.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
