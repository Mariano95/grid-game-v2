const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lobby = new Schema({
  name: {
    type: String
  },
  players: {
    type: Array
  },
  rooms: {
    type: Array
  }

},{
    collection: 'lobbies'
});

module.exports = mongoose.model('Lobby', Lobby);