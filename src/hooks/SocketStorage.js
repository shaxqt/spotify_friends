import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const Context = React.createContext()

function SocketStorage({ socket, setSocket, children }) {
  //const [socket, setSocket] = useState(null)

  useEffect(_ => {
    if (!socket) {
      console.log('Connecting Socket')
      const { spotify_friends_token } = localStorage
      const socket = io.connect('http://localhost:3333', {
        query: { spotify_friends_token }
      })
      setSocket(socket)
      if (socket) {
        socket.on('disconnect', function() {
          setSocket(null)
          console.log('client disconnected from server')
        })
      }
    }
  }, [])

  return <Context.Provider value={socket}>{children}</Context.Provider>
}
