const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  first_name: String,
  last_name: String,
});

module.exports = mongoose.model('User', UserSchema);
