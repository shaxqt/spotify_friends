const mongoose = require('mongoose')

const Top = new mongoose.Schema({
  userID: {
    type: String,
    required: true
  },
  type: { type: String, required: true },
  time_range: { type: String, required: true },
  lastFetched: { type: Number, default: 0 },
  items: { type: Array }
})
Top.index({ userID: 1, type: 1, time_range: 1 }, { unique: true })

module.exports = mongoose.model('Top', Top)
