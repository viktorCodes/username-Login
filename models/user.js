const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

//const User = mongoose.model('User', UserSchema)
module.exports = User = mongoose.model('User', UserSchema)