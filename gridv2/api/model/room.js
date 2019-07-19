const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
  player1: {
    type: String
  },
  player2: {
    type: String
  },
  board: {
    type: String
  }

},{
    collection: 'rooms'
});

module.exports = mongoose.model('Room', Room);