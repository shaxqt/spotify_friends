let clients = []

const get = _ => {
  return clients
}
const add = socket => {
  clients = [...clients, socket]
}
const remove = id => (clients = clients.filter(socket => socket.id === id))
const log = _ =>
  console.log(
    clients.length +
      ' clients: ' +
      clients.map(s => s.session.userID).join(', ')
  )

const emitToUserIDs = (userIDs, message, data) => {
  console.log('emitToUserIDs called for ' + userIDs.join(', '))
  log()
  userIDs.forEach(userID => {
    const socketsToPush = clients.filter(
      socket => socket.session.userID === userID
    )
    socketsToPush.forEach(socket => {
      console.log('pushing ' + message + ' to ' + socket.session.userID)
      socket.emit(message, data)
    })
  })
}
module.exports = { get, add, remove, log, emitToUserIDs }
