const express = require("express");
const lobbyRouter = express.Router();

const Player = require("../model/player");
const Lobby = require("../model/lobby");
const Room = require("../model/room");
const Board = require("../model/board");

const a_lobby = new Lobby({name: "Games lobby"});

//////////////////////////////////////////////////////////////////////////////

//DEBUG
lobbyRouter.route("/status").get((req,res) => {
  res.json(a_lobby);
});

//////////////////////////////////////////////////////////////////////////////

lobbyRouter.route("/login_lobby").post((req, res) => {
  let player = new Player({name: req.body.player_name});
  let player_id = player.id;
  player
    .save()
    .then( () => {
      a_lobby.players.push(player_id);
      res.send(player_id);
    })
    .catch( () => {
      res.send("Unable to login")
    });
});

lobbyRouter.route("/game/:room_id").post(async (req, res) => {
  if (await Player.findOne({_id: req.body.player_id})){
    await Room.findOneAndUpdate({_id: req.params.room_id},
                                {player2: req.body.player_id})
    .then( () => {
      res.send("Joined to the room");
    })
    .catch( () => {
      res.send("Unable to join room");
    })
  }
  else{
    res.send("Player does not exist")
  }
});

lobbyRouter.route("/game").post(async (req, res) => {
  if (await Player.findOne({_id: req.body.player_id})){
    board = new Board({data: [[0,0,0],[0,0,0],[0,0,0]],
                      game_ended: false,
                      tokensQty: 0,
                      playingPlayer: 1
                      });
    room = new Room ({player1: req.body.player_id, board: board.id});
  
    room
      .save()
      .then( () => {
        board.save()
        .catch( () => {
          res.send("Unable to create room");  
        })
        a_lobby.rooms.push(room.id);
        res.send(room.id);
      })
      .catch( () => {
        res.send("Unable to create room");
      })
  }
  else{
    res.send("Player does not exist");
  } 
});

//////////////////////////////////////////////////////////////////////////////

lobbyRouter.route("/games").get((req, res) => {
  res.send(a_lobby.rooms);
});

lobbyRouter.route("/game/:room_id").get(async (req, res) => {
  let room = await Room.findOne( {_id: req.params.room_id}); 
  if (room === null){
    res.send('Room not found');
  }
  else{
    res.json(room);
  }
});

//////////////////////////////////////////////////////////////////////////////

lobbyRouter.route("/game/:room_id").delete( async (req, res) => {
  await Room.deleteOne({_id: req.params.room_id})
  .then( () => {
    res.send("Room deleted succesfully")
  })
  .catch( () => {
    res.send("Unable to delete room")
  })
})


module.exports = lobbyRouter;