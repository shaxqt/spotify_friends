const mongoose = require('mongoose')

const UserSession = new mongoose.Schema({
  userID: {
    type: String
  },
  spotify_access_token: {
    type: String
  },
  spotify_refresh_token: {
    type: String
  },
  spotify_expires_in: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('UserSession', UserSession)
