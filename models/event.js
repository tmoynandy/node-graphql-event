const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const User = require('./user');

const eventSchema = new Schema({
    title : { type : String, required : true},
    description : { type : String, required : true},
    price : { type : Number, required : true},
    date : { type : Date, required : true},
    creator :{
        type :Schema.Types.ObjectId,
        ref : 'User'
    }
});

module.exports = mongoose.model('Event', eventSchema);