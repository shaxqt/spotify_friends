import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import User from './User'
import Wrapper from '../form/FormWrapper'

storiesOf('User', module)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <User
      name={text('name', 'Philp Loesch')}
      id={text('id', 'shaxqt')}
      onClick={action('clicked')}
    />
  ))
