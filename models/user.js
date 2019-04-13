const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : { type : String, required : true},
    password : { type : String, required : true},
    //created events is a list and we go on to define the property of one element in that array
    createdEvents : [
        {
            type : Schema.Types.ObjectId,
            //tells mongoose two models are related
            ref : 'Event'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);