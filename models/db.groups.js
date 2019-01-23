const mongoose = require('mongoose');

const groups = new mongoose.Schema({
    name:String,
    description:String
});
module.exports = mongoose.model('groups',groups); 