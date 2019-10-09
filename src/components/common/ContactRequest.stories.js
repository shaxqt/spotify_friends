import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs/react'
import ContactRequest from './ContactRequest'

storiesOf('ContactRequest', module).add('default', () => (
  <ContactRequest
    display_name={text('display_name', 'Philip Loesch')}
    onAccept={action('accepted')}
    onDeny={action('denied')}
  />
))
