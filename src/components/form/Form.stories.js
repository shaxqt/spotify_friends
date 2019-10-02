import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Form from './Form'
import Button from './Button'
import Input from './Input'
import GlobalStyles from '../utils/GlobalStyles'
import Wrapper from '../utils/StoryWrapper'
import { withInfo } from '@storybook/addon-info'

storiesOf('Form', module)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <>
      <GlobalStyles />
      <Form paddingTop={text('paddingTop', '0px')} onSubmit={action('submit')}>
        <Input inputIcon="fa fa-search" placeholder="search"></Input>
        <Button text="search" />
      </Form>
    </>
  ))
