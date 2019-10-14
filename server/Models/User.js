const mongoose = require('mongoose')

const User = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: { unique: true, dropDups: true }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  display_name: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  href: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  fetchedCurrSong: {
    type: Number,
    default: 0
  },
  isUserImagePublic: { type: Boolean, default: true },
  images: { type: [Object] },
  currSong: { type: Object }
})

module.exports = mongoose.model('User', User)
