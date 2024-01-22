const Comment = require('../models/comment_model'); //the mongoose schema for Comment
const {generateDBErrorMsg} = require('../helpers/generateDBErrorMsg');
const { logger } = require('../backend_logger');

exports.create = (req, res) => {
    const {text, slug} = req.body;
    const userid = req.auth._id;
    //check if user email exists
    const newComment = Comment({text, slug, postedBy : userid});
    newComment.save()
    .then(data => {
        return res.json({
            success : true
        });
    })
    .catch((err) => {
        logger.error(err.message);
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    });
}

exports.get = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const limit = req.body.limit ? parseInt(req.body.limit) : 5 //number of posts/categories/tags to be loaded in one go
    const skip = req.body.skip ? parseInt(req.body.skip) : 0 //how many to skip i.e. already loaded
    Comment.find({slug}) //find all with slug
    .populate('postedBy', 'username photo')
    .select('-slug')
    .sort({createdAt: -1}) //newest first
    .skip(skip)
    .limit(limit)
    .exec()
    .then((data) => {
        return res.json(data);
    })
    .catch((err) => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        });
    });
}

