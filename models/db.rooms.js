const mongoose = require('mongoose');

const rooms = new mongoose.Schema({
    name:String,
    date:Number,
    wplayer: { type:mongoose.Schema.Types.ObjectId, ref:'users'},
    wsocket:String,
    bplayer:{ type:mongoose.Schema.Types.ObjectId, ref:'users'},
    bsocket:String,
    steps:[],
    currentState:{},
    movePlayer:{ type:mongoose.Schema.Types.ObjectId, ref:'users',default:null}
    
});
module.exports = mongoose.model('rooms',rooms); 