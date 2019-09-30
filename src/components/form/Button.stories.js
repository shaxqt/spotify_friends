import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Button from './Button'

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

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <Button onClick={action('clicked')} text={text('text', 'search')} />
  ))
