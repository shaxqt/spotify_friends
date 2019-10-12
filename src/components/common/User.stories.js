import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { text, boolean, object } from '@storybook/addon-knobs/react'
import User from './User'

storiesOf('User', module)
  .add('default', () => (
    <User
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', true)}
      isRetractButtonActive={boolean('isRetractButtonActive', false)}
      contactInfo={text('contactInfo', '')}
    />
  ))
  .add('retract request', () => (
    <User
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', false)}
      isRetractButtonActive={boolean('isRetractButtonActive', true)}
      contactInfo={text('contactInfo', 'request already sent')}
    />
  ))
  .add('already friends', () => (
    <User
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', false)}
      isRetractButtonActive={boolean('isRetractButtonActive', false)}
      contactInfo={text('contactInfo', 'already in your contacts')}
    />
  ))
  .add('with picture', () => (
    <User
      images={object('images', [
        {
          height: null,
          width: null,
          url:
            ' https://profile-images.scdn.co/images/userprofile/default/2d6365ee0188dcb542111292a0797fbf442482b4'
        }
      ])}
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', false)}
      isRetractButtonActive={boolean('isRetractButtonActive', false)}
      contactInfo={text('contactInfo', 'already in your contacts')}
    />
  ))
  .add('with picture and button', () => (
    <User
      images={object('images', [
        {
          height: null,
          width: null,
          url:
            ' https://profile-images.scdn.co/images/userprofile/default/2d6365ee0188dcb542111292a0797fbf442482b4'
        }
      ])}
      display_name={text('display_name', 'Philip Loesch')}
      onClick={action('clicked')}
      isAddButtonActive={boolean('isAddButtonActive', true)}
      isRetractButtonActive={boolean('isRetractButtonActive', false)}
      contactInfo={text('contactInfo', 'already in your contacts')}
    />
  ))
