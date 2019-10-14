import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import { object } from '@storybook/addon-knobs/react'
import FriendsCurrSong from './FriendsCurrSong'

const friend = getExampleFriend()

storiesOf('FriendsCurrSong', module).add('default', () => (
  <FriendsCurrSong
    friend={object('contact', friend)}
    onPlay={action('playing song on spotify...')}
  />
))

function getExampleFriend() {
  return {
    id: '0clduq80zds5wzpehuq6uf6bq',
    display_name: 'shax',
    images: [],
    fetchedCurrSong: 1571056708109,
    status: 20,
    createTime: '2019-10-14T10:19:57.864Z',
    _id: '5da459ea1b81b98af83b8b6a',
    source: '0clduq80zds5wzpehuq6uf6bq',
    target: 'shaxqt',
    combinedID: 'shaxqt0clduq80zds5wzpehuq6uf6bq',
    __v: 0,
    currSong: {
      timestamp: 1571049922906,
      context: {
        external_urls: {
          spotify: 'https://open.spotify.com/album/4XOMJHVuzJVWmqUdp4SYKP'
        },
        href: 'https://api.spotify.com/v1/albums/4XOMJHVuzJVWmqUdp4SYKP',
        type: 'album',
        uri: 'spotify:album:4XOMJHVuzJVWmqUdp4SYKP'
      },
      progress_ms: 7778,
      item: {
        album: {
          album_type: 'album',
          artists: [
            {
              external_urls: {
                spotify:
                  'https://open.spotify.com/artist/5tFRohaO5yEsuJxmMnlCO9'
              },
              href: 'https://api.spotify.com/v1/artists/5tFRohaO5yEsuJxmMnlCO9',
              id: '5tFRohaO5yEsuJxmMnlCO9',
              name: 'Barns Courtney',
              type: 'artist',
              uri: 'spotify:artist:5tFRohaO5yEsuJxmMnlCO9'
            }
          ],

          external_urls: {
            spotify: 'https://open.spotify.com/album/4XOMJHVuzJVWmqUdp4SYKP'
          },
          href: 'https://api.spotify.com/v1/albums/4XOMJHVuzJVWmqUdp4SYKP',
          id: '4XOMJHVuzJVWmqUdp4SYKP',
          images: [
            {
              height: 640,
              url:
                'https://i.scdn.co/image/ab67616d0000b273c43ac981c6d7d1db6e6d633a',
              width: 640
            },
            {
              height: 300,
              url:
                'https://i.scdn.co/image/ab67616d00001e02c43ac981c6d7d1db6e6d633a',
              width: 300
            },
            {
              height: 64,
              url:
                'https://i.scdn.co/image/ab67616d00004851c43ac981c6d7d1db6e6d633a',
              width: 64
            }
          ],
          name: '404',
          release_date: '2019-09-06',
          release_date_precision: 'day',
          total_tracks: 10,
          type: 'album',
          uri: 'spotify:album:4XOMJHVuzJVWmqUdp4SYKP'
        },
        artists: [
          {
            external_urls: {
              spotify: 'https://open.spotify.com/artist/5tFRohaO5yEsuJxmMnlCO9'
            },
            href: 'https://api.spotify.com/v1/artists/5tFRohaO5yEsuJxmMnlCO9',
            id: '5tFRohaO5yEsuJxmMnlCO9',
            name: 'Barns Courtney',
            type: 'artist',
            uri: 'spotify:artist:5tFRohaO5yEsuJxmMnlCO9'
          }
        ],

        disc_number: 1,
        duration_ms: 209146,
        explicit: true,
        external_ids: {
          isrc: 'GBUM71900450'
        },
        external_urls: {
          spotify: 'https://open.spotify.com/track/5wxjGTx4Q8esdYMd7SWHZI'
        },
        href: 'https://api.spotify.com/v1/tracks/5wxjGTx4Q8esdYMd7SWHZI',
        id: '5wxjGTx4Q8esdYMd7SWHZI',
        is_local: false,
        name: 'Hollow',
        popularity: 52,
        preview_url: null,
        track_number: 1,
        type: 'track',
        uri: 'spotify:track:5wxjGTx4Q8esdYMd7SWHZI'
      },
      currently_playing_type: 'track',
      actions: {
        disallows: {
          pausing: true,
          skipping_prev: true
        }
      },
      is_playing: false
    }
  }
}
