const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { CONSTANTS } = require('../CONSTANTS')
const { logger } = require('../backend_logger')

const categories_schema = new mongoose.Schema({
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

module.exports = mongoose.model("Category", categories_schema);