const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { firstValues } = require('formidable/src/helpers/firstValues.js');

const User = require('../models/user_model');
const Blog = require('../models/blog_model');
const { generateDBErrorMsg } = require('../helpers/generateDBErrorMsg');

exports.read = (req, res) => {
    req.profile.hashed_password = undefined; //the profile is added in the authMiddleware of auth_controllers
    return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
    const username = req.params.username;
    const user = User.findOne({username})
        .select('-photo -hashed_password')
        .exec()
        .then((user) => {
            if (!user) {
                res.status(400).json({
                    error : 'User not found'
                });
                return {error : true}
            }
            return user;
        })
    user.then((user) => {
        if (user.error) {
            return;
        }
        Blog.find({postedBy : user._id})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .limit(10)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .sort({createdAt: 'descending'})
        .exec()
        .then((blogs) => {
            res.json({
                user, blogs
            })
        })
        .catch((err) => {
            res.status(400).json({
                error : generateDBErrorMsg(err)
            });
        })
    });
}

exports.update = (req, res) => {
    const form = new formidable.IncomingForm({keepExtensions : true});
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error : err.message
            })
        }
        const user = req.profile;
        const values = firstValues(form, fields, []);
        //validation of password
        if (values.password && values.password.length < 6) {
            return res.status(400).json({
                error : 'Password is shorter than the minimum length of 6 characters'
            })
        } 
        //hashpassword password
        if (values.password) {
            await user.setPassword(values.password);
            values.password = undefined; 
        }
        _.extend(user, values);
        console.log(user.hashed_password);
        const { photo } = firstValues(form, files, []);
        if (photo) {
            if (photo.size > 1000000) {
                return res.status(400).json({
                    error : 'image should be less than 1mb'
                })
            }
            user.photo.data = fs.readFileSync(photo.filepath);
            user.photo.contentType = photo.mimetype;
        }
        user.save()
        .then((user) => {
            user.hashed_password = undefined;
            res.json(user);
        })
        .catch(err => {
            return res.status(400).json({
                error : generateDBErrorMsg(err)
            })
        })
    })
}

exports.photo = (req, res) => {
    const username = req.params.username;
    User.findOne({username})
    .exec()
    .then((user) => {
        if (!user) {
            return res.status(400).json({
                error : `Username ${username} not found`
            })
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType)
            return res.send(user.photo.data);
        } else {
            res.status(404).json({
                error : 'No image set by user'
            })
        }

    })
    .catch((err) => {
        return res.status(400).json({
            error : generateDBErrorMsg(err)
        })
    })
}