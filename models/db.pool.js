const mongoose = require('mongoose');

const pools = new mongoose.Schema({
    userid: { type:mongoose.Schema.Types.ObjectId, ref:'users'},
    socketid:String,
    quetime:Number,
    opponentSocket:String 
});
module.exports = mongoose.model('pool',pools); 