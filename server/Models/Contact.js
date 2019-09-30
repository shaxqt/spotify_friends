const mongoose = require('mongoose')

const Contact = new mongoose.Schema({
  source: {
    type: String,
    unique: false
  },
  target: {
    type: String,
    unique: false
  },
  status: {
    type: Number,
    default: 0
  },
  message: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now()
  }
})

Contact.index({ source: 1, target: 1 }, { unique: true })
Contact.index({ target: 1, source: 1 }, { unique: true })

module.exports = mongoose.model('Contact', Contact)
