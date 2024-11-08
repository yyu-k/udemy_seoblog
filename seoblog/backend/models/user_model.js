const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { CONSTANTS } = require('../CONSTANTS')
const { logger } = require('../backend_logger')



const user_schema = new mongoose.Schema({
    username : {
        type : String,
        trim : true, //remove whitespace
        required : true,
        max : 32,
        unique : true,
        index : true, //indexable
        lowercase : true //set to lowercase before sending to DB
    },
    name : {
        type : String,
        trim : true, //remove whitespace
        required : true,
        max : 32,
    },
    email : {
        type : String,
        trim : true, //remove whitespace
        required : true,
        unique : true,
        lowercase : true
    },
    profile : {
        type : String,
        required : true
    },
    hashed_password : {
        type : String,
        required : true
    },
    role : {
        type : Number,
        default : 0
    },
    photo : {
        data : Buffer,
        contentType : String
    },
    about : {
        type : String,
        trim : true
    },
    reset_password_link : {
        type : String,
        default : '' //reset_password_link is empty by default
    }
}, {timestamps : true});

user_schema.methods = {
    //authenticate password
    authenticate : async function(plainText){
        const result = await bcrypt.compare(plainText, this.hashed_password);
        return result;
    },
    setPassword : async function(password) {
        this.hashed_password = await bcrypt.hash(password, CONSTANTS.bcrypt_salt_rounds);
        return this;
    }
}

//virtual fields do not get saved into the db
//Removed because using synchronous functions in backend is a bad idea
// user_schema.virtual('password')
//     //function keyword is needed so that this scope can be properly accessed
//     .set(function(password) {
//         this.hashed_password = bcrypt.hashSync(password,CONSTANTS.bcrypt_salt_rounds)
//     })

module.exports = mongoose.model('User', user_schema);