const mongoose = require('mongoose')

const userModel = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  pic: {type: String, default: process.env.DEFAULT_PROFILE_PIC, required: true}
},
{
  timestamps: true,
})

const User = mongoose.model("User", userModel);

module.exports = User;