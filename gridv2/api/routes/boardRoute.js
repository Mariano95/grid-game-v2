const express = require("express");
const boardRouter = express.Router();

const Board = require("../model/board");

const db = require("../db/db");

boardRouter.route("/create").post(async (req, res) => {
  let saved_board = await Board.findOne({name: req.body.name});
  if (saved_board === null ){
    const board = new Board(req.body);
    board.save()
      .then(board => {
        res.json("Board added successfully");
      })
      .catch(err => {
        res.status(400).send("Unable to save to database");
      });
  }
  else {
    saved_board.data = req.body.data;
    saved_board.game_ended = req.body.game_ended;
    saved_board.tokensQty = req.body.tokensQty;
    saved_board.playing_player = req.body.playing_player;
    saved_board
      .save()
      .then(board => {
        res.json("Board updated successfully");
      })
      .catch(err => {
        res.status(400).send("Unable to update");
      });
  }
});

boardRouter.get("/retrieve", async (req, res) => {
  const board_name = req.query.board_name;
  let board = await Board.findOne({name: board_name});
  res.send(board);
});

// An example on how to concatenate queries
// playerRouter.get("/retrieve", async (req, res) => {
//   const user_name = req.query.user_name;
//   let player = await Player.find({
//     $or: [
//       {
//         name: { $eq: user_name },
//         wins: { $gt: 1 }
//       },
//       { wins: { $gt: 5 } }
//     ]
//   });
//   console.log(player);
// });

module.exports = boardRouter;