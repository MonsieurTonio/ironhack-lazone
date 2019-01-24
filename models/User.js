const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


// USER MODEL

const userSchema = new Schema ({
  username: { type: String, required: true },
  password: String,
  avatarUrl: { type: String, default: 'images/default-avatar.png' },
  label: String,
  artistsFollowed: [ { type : Schema.Types.ObjectId, ref: 'Artist' } ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;