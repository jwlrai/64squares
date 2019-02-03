const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    image:String,
    date:Number,
    group: [{ type:mongoose.Schema.Types.ObjectId, ref:'groups'}],
    
});
module.exports = mongoose.model('users',users); 