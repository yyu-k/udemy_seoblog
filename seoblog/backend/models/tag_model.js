const mongoose = require('mongoose');

const tag_schema = new mongoose.Schema({
    name : {
        type : String,
        trim : true, //remove whitespace
        required : true,
        max : 32
    },
    slug : {
        type : String,
        unique : true,
        index : true
    }
}, {timestamp : true});

module.exports = mongoose.model("Tag", tag_schema);