const Category = require('../models/categories_model');
const slugify = require('slugify');

const generateErrorMsg = (err) => {
    let errorMsg;
    switch(err.code) {
        case 11000:
        case 11001:
            errorMsg = 'Duplicate Categories Error - Category already exists';
            break;
        default:
            errorMsg = 'Something has gone wrong with the database operation';
    }
    return `Error ${err.code}: ${errorMsg}`;
}

exports.create = (req, res) => {
    const { name } = req.body; 
    const slug = slugify(name, {
        lower : true
    });
    const category = new Category({name, slug});
    category.save()
    .then((success) => {
        res.json(success); //the success is already an object with name and slug fields
    })
    .catch((err) => {
        res.status(400).json({
            error : generateErrorMsg(err)
        });
    })
}

exports.list = (req, res) => {
    Category.find({}).exec()
    .then((success) => {
        res.json(success);
    })
    .catch((err) => {
        res.status(400).json({
            error: generateErrorMsg(err)
        });
    })
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Category.findOne({slug})
    .exec()
    .then((success) => {
        res.json(success) 
        //TODO: return blogs associated with that category
    })
    .catch((err) => {
        res.status(400).json({
            error : generateErrorMsg(err)
        });
    });
}

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Category.findOneAndRemove({slug})
    .exec()
    .then((success) => {
        res.json({
            message : `Category ${req.params.slug} deleted successfully`
        }) 
    })
    .catch((err) => {
        res.status(400).json({
            error : generateErrorMsg(err)
        });
    });
}