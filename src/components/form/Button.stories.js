import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs/react'
import Button from './Button'

storiesOf('Button', module)
  .add('default', () => (
    <Button
      onClick={action('clicked')}
      text={text('text', 'search')}
      color={text('color', 'rgb(30, 215, 97)')}
      borderButton={boolean('borderButton', false)}
      noCaps={boolean('noCaps', false)}
    />
  ))
  .add('in red', () => (
    <Button
      onClick={action('clicked')}
      text={text('text', 'deny')}
      color={text('color', 'red')}
      borderButton={boolean('borderButton', false)}
      noCaps={boolean('noCaps', false)}
    />
  ))
  .add('border button', () => (
    <Button
      onClick={action('clicked')}
      text={text('text', 'deny')}
      color={text('color', 'red')}
      borderButton={boolean('borderButton', true)}
      noCaps={boolean('noCaps', false)}
    />
  ))
  .add('no caps', () => (
    <Button
      onClick={action('clicked')}
      text={text('text', 'deny')}
      color={text('color', 'red')}
      borderButton={boolean('borderButton', true)}
      noCaps={boolean('noCaps', true)}
    />
  ))
