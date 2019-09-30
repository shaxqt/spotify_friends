import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Input from './Input'

function Wrapper(storyFn) {
  return (
    <div
      style={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#222',
        padding: '20px'
      }}
    >
      {storyFn()}
    </div>
  )
}

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <Input
      type={text('type', 'text')}
      label={text('label', 'search')}
      onChange={action('onChange')}
    />
  ))
