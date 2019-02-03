const mongoose = require("mongoose");
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/64squares", {useNewUrlParser: true} );

const users     = require('./db.users');
const rooms     = require('./db.rooms');
const pools     = require('./db.pool');
const groups    = require('./db.groups');
const sessions  = require('./db.session');
const gameHistory   = require('./db.gameHistory');
const userRoom = require('./db.userRooms');

module.exports = {
    users       : users,
    rooms       : rooms,
    gameHistory : gameHistory,
    groups      : groups,
    sessions    : sessions,
    pools       : pools,
    userRoom    : userRoom
}