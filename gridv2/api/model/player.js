const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Player = new Schema({
  name: {
    type: String
  },
  wins: {
    type: Number
  }
},{
    collection: 'players'
});

module.exports = mongoose.model('Player', Player);