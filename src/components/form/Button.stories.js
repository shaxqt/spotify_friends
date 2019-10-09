import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs/react'
import Button from './Button'

storiesOf('Button', module)
  .add('default', () => (
    <Button
      onClick={action('clicked')}
      text={text('text', 'search')}
      color={text('color', 'rgb(30, 215, 97)')}
    />
  ))
  .add('in red', () => (
    <Button
      onClick={action('clicked')}
      text={text('text', 'deny')}
      color={text('color', 'red')}
    />
  ))
