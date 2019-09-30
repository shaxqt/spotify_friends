import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs/react'
import Form from './Form'
import Button from './Button'
import Input from './Input'
import GlobalStyles from '../utils/GlobalStyles'
function Wrapper(storyFn) {
  return (
    <div
      style={{
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#222',
        padding: '20px'
      }}
    >
      {storyFn()}
    </div>
  )
}

storiesOf('Form', module)
  .addDecorator(withKnobs)
  .addDecorator(Wrapper)
  .add('default', () => (
    <>
      <GlobalStyles />
      <Form
        paddingTop={text('paddingTop', '200px')}
        onSubmit={action('submit')}
      >
        <Input label="search"></Input>
        <Button text="search" />
      </Form>
    </>
  ))
