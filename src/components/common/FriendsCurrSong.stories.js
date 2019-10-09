import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { object } from '@storybook/addon-knobs/react'
import FriendsCurrSong from './FriendsCurrSong'

const contact = {
  display_name: 'Philip',
  currSong: {
    artists: ['257ers', 'Captain Jack'],
    name: 'Akk & Feel It (feat. Captain Jack)',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d0000b27351470ddbc018d13a91c04576',
        height: '640',
        width: '640'
      }
    ]
  }
}
storiesOf('FriendsCurrSong', module).add('default', () => (
  <FriendsCurrSong
    contact={object('contact', contact)}
    onPlay={action('playing song on spotify...')}
  />
))
