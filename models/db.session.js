const mongoose = require('mongoose');

const sessions = new mongoose.Schema({
    userid: [{ type:mongoose.Schema.Types.ObjectId, ref:'users'}],
    expire:Number
});
module.exports = mongoose.model('sessions',sessions); 