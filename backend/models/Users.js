const mongoose = require("../database");
const { Schema, mongo } = require("../database");

const userSchema = new mongoose.Schema({
  users: {
    type: Map, 
    of: Object
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;