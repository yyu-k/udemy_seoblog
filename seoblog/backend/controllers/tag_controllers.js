const Tag = require('../models/tag_model');
const Blog = require('../models/blog_model');
const slugify = require('slugify');
const { generateDBErrorMsg } = require('../helpers/generateDBErrorMsg');


exports.create = (req, res) => {
    const { name } = req.body; 
    const slug = slugify(name, {
        lower : true
    });
    const tag = new Tag({name, slug});
    tag.save()
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
    Tag.find({}).exec()
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
    const tagResult = 
        Tag.findOne({slug}).exec()
        .then((success) => {
            if (success === null) {
                return {error : 'Tag not found'}
            }
            return (success) 
        })
        .catch((err) => {
            return ({
                error : generateDBErrorMsg(err)
            });
        });
    const blogResult = tagResult.then((tag) => {
        if (tag.error) {
            return tag
        } else {
            return (
                Blog.find({tags : tag})
                .populate('categories', '_id name slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name')
                .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
                .exec()
                .then((blog) => {
                    return {tag : tag, blogs : blog}
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
    Tag.findOneAndRemove({slug})
    .exec()
    .then((success) => {
        res.json({
            message : `Tag ${req.params.slug} deleted successfully`
        }) 
    })
    .catch((err) => {
        res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    });
}