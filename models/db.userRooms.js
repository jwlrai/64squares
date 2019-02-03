const mongoose = require('mongoose');

const userRooms = new mongoose.Schema({
    room:String,
    game:Boolean,
    date:Number,
    userid: { type:mongoose.Schema.Types.ObjectId, ref:'users'},
    socket:String
    
});
module.exports = mongoose.model('UserRooms',userRooms); 