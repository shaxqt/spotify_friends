import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text } from '@storybook/addon-knobs/react'
import Form from './Form'
import Button from './Button'
import Input from './Input'
import GlobalStyles from '../utils/GlobalStyles'

storiesOf('Form', module).add('default', () => (
  <>
    <GlobalStyles />
    <Form paddingTop={text('paddingTop', '0px')} onSubmit={action('submit')}>
      <Input inputIcon="fa fa-search" placeholder="search"></Input>
      <Button text="search" />
    </Form>
  </>
))
