import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import ContactRequest from './ContactRequest'
import Wrapper from '../utils/StoryWrapper'
import { withInfo } from '@storybook/addon-info'

storiesOf('ContactRequest', module)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <ContactRequest
      display_name={text('display_name', 'Philip Loesch')}
      onAccept={action('accepted')}
      onDeny={action('denied')}
    />
  ))
