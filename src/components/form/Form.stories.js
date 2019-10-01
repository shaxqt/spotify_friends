import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Form from './Form'
import Button from './Button'
import Input from './Input'
import GlobalStyles from '../utils/GlobalStyles'
import Wrapper from '../form/FormWrapper'

storiesOf('Form', module)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <>
      <GlobalStyles />
      <Form paddingTop={text('paddingTop', '0px')} onSubmit={action('submit')}>
        <Input label="search"></Input>
        <Button text="search" />
      </Form>
    </>
  ))
  .add('noch was', () => (
    <Form>
      <Input text="test"></Input>
    </Form>
  ))
