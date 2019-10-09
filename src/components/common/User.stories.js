import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs/react'
import User from './User'

storiesOf('User', module)
  .add('default', () => (
    <User
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', true)}
      isRetractButtonActive={boolean('isRetractButtonActive', false)}
      contactInfo={text('contactInfo', '')}
    />
  ))
  .add('retract request', () => (
    <User
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', false)}
      isRetractButtonActive={boolean('isRetractButtonActive', true)}
      contactInfo={text('contactInfo', 'request already sent')}
    />
  ))
  .add('already friends', () => (
    <User
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', false)}
      isRetractButtonActive={boolean('isRetractButtonActive', false)}
      contactInfo={text('contactInfo', 'already in your contacts')}
    />
  ))
