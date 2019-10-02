import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Input from './Input'
import Wrapper from '../utils/StoryWrapper'

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <Input
      placeholder={text('placeholder', 'search')}
      type={text('type', 'text')}
      label={text('label', 'search')}
      inputIcon={text('inputIcon', 'fa fa-search')}
      onChange={action('onChange')}
    />
  ))
  .add('without label', () => (
    <Input
      placeholder={text('placeholder', 'search')}
      type={text('type', 'text')}
      label={text('label', '')}
      inputIcon={text('inputIcon', 'fa fa-search')}
      onChange={action('onChange')}
    />
  ))
