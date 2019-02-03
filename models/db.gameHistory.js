const mongoose = require('mongoose');

const history = new mongoose.Schema({
    roomName:String,
    startDate: Number,
    endDate:Number,
    bplayer:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
    wplayer:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
    moves:[],
    winner:{type:mongoose.Schema.Types.ObjectId, ref:'users'}
});
module.exports = mongoose.model('history',history); 