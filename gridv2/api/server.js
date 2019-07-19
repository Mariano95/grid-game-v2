const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const config = require('./db/db');
const lobbyRoute = require('./routes/lobbyRoute');
const playerRoute = require('./routes/playerRoute');
const boardRoute = require('./routes/boardRoute');

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', lobbyRoute);
app.use('/api/player', playerRoute);
app.use('/api/board', boardRoute);

app.listen(PORT, () => {
  console.log('Server is running on PORT:',PORT);
});