import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Input from './Input'
import Wrapper from '../form/FormWrapper'

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
