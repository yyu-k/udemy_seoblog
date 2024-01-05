const { generateDBErrorMsg } = require('../helpers/generateDBErrorMsg');
const Category = require('../models/categories_model');
const Blog = require('../models/blog_model');
const slugify = require('slugify');

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
            error : generateDBErrorMsg(err)
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
            error: generateDBErrorMsg(err)
        });
    })
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const catResult = 
        Category.findOne({slug}).exec()
        .then((success) => {
            if (success === null) {
                return {error : 'Category not found'}
            }
            return (success) 
        })
        .catch((err) => {
            return ({
                error : generateDBErrorMsg(err)
            });
        });
    const blogResult = catResult.then((cat) => {
        if (cat.error) {
            return cat
        } else {
            return (
                Blog.find({categories : cat})
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name')
                .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
                .exec()
                .then((blog) => {
                    return {category : cat, blogs : blog}
                }).catch((err) => {
                    return ({
                        error : generateDBErrorMsg(err)
                    });
                })
            );
        }
    });
    blogResult.then(data => {
        if (data.error) {
            return res.status(400).json(data);
        } else {
            return res.json(data);
        }
    })
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
            error : generateDBErrorMsg(err)
        });
    });
}