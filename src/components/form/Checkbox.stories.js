import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs/react'
import Checkbox from './Checkbox'

storiesOf('Checkbox', module).add('default', () => (
  <Checkbox label={text('label', 'Profilbild in der Suche zeigen')} />
))
