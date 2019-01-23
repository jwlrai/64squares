const mongoose = require('mongoose');

const history = new mongoose.Schema({
    roomName:String,
    startDate: Number,
    endDate:Number,
    player:[{type:mongoose.Schema.Types.ObjectId, ref:'users'}],
    details:[
        {
            move: { type: String, required: true},
            date: { type: String, required: true}
        }
    ]
});
module.exports = mongoose.model('history',history); 