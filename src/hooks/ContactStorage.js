import React from 'react'

export const Context = React.createContext()

function reducer(state, action) {
  switch (action.type) {
    default:
      return state
  }
}
export default function ContactStorage({ socket, children }) {
  const [state, dispatch] = useReducer(reducer)
  socket.emmit('hello', 'hello from contact storage')

  return <Context.Provider value={socket}>{children}</Context.Provider>
}
