const express = require("express");
const playerRouter = express.Router();

const Player = require("../model/player");
const Lobby = require("../model/lobby");

playerRouter.route("/create").post(async (req, res) => {
  const player = new Player(req.body);
  let saved_player = await Player.findOne({name: req.body.name});
  if (saved_player === null ){
    player.save()
      .then(player => {
        res.json("Player added successfully");
      })
      .catch(err => {
        res.status(400).send("Unable to save to database");
      });
  }
  else {
    saved_player.wins = req.body.wins;
    saved_player
      .save()
      .then(player => {
        res.json("Player updated successfully");
      })
      .catch(err => {
        res.status(400).send("Unable to update");
      });
  }
});

playerRouter.get("/retrieve", async (req, res) => {
  const user_name = req.query.user_name;
  let player = await Player.findOne({name: user_name});
  res.send(player);
});

module.exports = playerRouter;