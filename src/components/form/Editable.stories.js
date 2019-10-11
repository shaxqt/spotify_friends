import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs/react'
import Editable from './Editable'

storiesOf('Editable', module).add('default', () => (
  <Editable
    value={text('value', 'Hans Peter')}
    onNewValue={action('new value')}
  />
))
