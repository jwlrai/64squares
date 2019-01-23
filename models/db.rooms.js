const mongoose = require('mongoose');

const rooms = new mongoose.Schema({
    name:String,
    date:Number,
    playerId: [{ type:mongoose.Schema.Types.ObjectId, ref:'users'}],
    audienceId:[{ type:mongoose.Schema.Types.ObjectId, ref:'users'}]
    
    
});
module.exports = mongoose.model('rooms',rooms); 