import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text, boolean } from '@storybook/addon-knobs/react'
import Editable from './Editable'

storiesOf('Editable', module).add('default', () => (
  <Editable
    value={text('value', 'Hans Peter')}
    onSubmit={action('submit')}
    label={text('label', 'display name')}
    isEditable={boolean('isEditable', true)}
    type="text"
  />
))
