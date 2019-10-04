const mongoose = require('mongoose')

const Contact = new mongoose.Schema({
  source: {
    type: String
  },
  target: {
    type: String
  },
  combinedID: {
    type: String
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

// make sure target and source are unique in any order
Contact.pre('save', function(next) {
  this.combinedID =
    this.target > this.source
      ? this.target + this.source
      : this.source + this.target
  next()
})

Contact.index({ combinedID: 1 }, { unique: true })

module.exports = mongoose.model('Contact', Contact)
