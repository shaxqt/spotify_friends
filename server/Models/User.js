const mongoose = require('mongoose')

const User = new mongoose.Schema({
  displayName: {
    type: String
  },
  userName: {
    type: String
  },
  email: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('User', User)
