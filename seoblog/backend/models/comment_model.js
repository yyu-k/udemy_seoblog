const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;
const commentSchema = new mongoose.Schema({
    text : {
        type : String,
        trim : true, //remove whitespace
        required : true,
        minLength: 3,
        maxLength : 160, 
    },
    slug : {
        type : String,
        index : true
    },
    postedBy : {
        type: ObjectId,
        ref: 'User'
    }
}, {timestamps : true});

module.exports = mongoose.model('Comment', commentSchema);