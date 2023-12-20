const mongoose = require('mongoose');


const { ObjectId } = mongoose.Schema;
const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true, //remove whitespace
        required : true,
        min: 3,
        max : 160, //don't think this actually does anything
    },
    slug : {
        type : String,
        unique : true, //remove whitespace
        required : true,
        index : true
    },
    body : {
        type : {}, //all kinds of data allowed for empty object
        required : true,
        min: 200,
        max: 2000000 //Not sure if this actually does anything?
    },
    excerpt : {
        type : String,
        required : false,
        max : 1000
    },
    metaTitle : {
        type : String
    },
    metaDescription : {
        type : String
    },
    photo : {
        data : Buffer,
        contentType : String
    },
    categories : [ //an array of ObjectIds from the Category schema
        {type: ObjectId, 
        ref: 'Category',
        required: true}
    ],
    tags : [ 
        {type: ObjectId, 
        ref: 'Tag',
        required: true}
    ],
    postedBy : {
        type: ObjectId,
        ref: 'User'
    }
}, {timestamp : true});

module.exports = mongoose.model('Blog', blogSchema);