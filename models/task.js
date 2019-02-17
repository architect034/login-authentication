const mongoose = require('mongoose');
// const validator = require('validator');
// const jwt = require('jsonwebtoken');
// const _ =require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    text: {
        type: String,
        required: true
    },
});



var Tasks = mongoose.model('Tasks',UserSchema);
module.exports = {
    Tasks:Tasks
}
