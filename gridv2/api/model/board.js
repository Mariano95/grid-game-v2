const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Board = new Schema({
  data: {
    type: Array
  },
  game_ended: {
    type: Boolean
  },
  tokensQty: {
    type: Number
  },
  playingPlayer: {
    type: Number
  }

},{
  collection: 'boards'
});

module.exports = mongoose.model('Board', Board);