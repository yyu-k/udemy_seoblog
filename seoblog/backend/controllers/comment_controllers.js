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
    Comment.find({slug}) //find all with slug
    .populate('postedBy', 'username photo')
    .select('-slug')
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

