import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs/react'
import Checkbox from './Checkbox'

storiesOf('Checkbox', module)
  .add('default', () => (
    <Checkbox
      label={text('label', 'Profilbild in der Suche zeigen')}
      value={boolean('value', true)}
      onChange={action('clicked')}
    />
  ))
  .add('not checked', () => (
    <Checkbox
      label={text('label', 'Profilbild in der Suche zeigen')}
      value={boolean('value', false)}
      onChange={action('clicked')}
    />
  ))
  .add('with info', () => (
    <Checkbox
      label={text('label', 'Profilbild in der Suche zeigen')}
      value={boolean('value', true)}
      onChange={action('clicked')}
      info={text(
        'info',
        'Macht es für deine Freunde einfacher dich zu indentifizieren'
      )}
    />
  ))
