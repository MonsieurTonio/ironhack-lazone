const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


// USER MODEL

const userSchema = new Schema ({
  firstName : { type: String, required: true },
  lastName : { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmationCode : String,
  avatarUrl: { type: String, default: 'images/default-avatar.png' },
  company: { type: String, required: true },
  artistsFollowed: [ { type : Schema.Types.ObjectId, ref: 'Artist' } ]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;