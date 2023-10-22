const User = require('../models/user_model'); //the mongoose schema for User
const  { nanoid } = require('nanoid');
const { logger } = require('../backend_logger')
const jwt = require('jsonwebtoken');
const {expressjwt} = require('express-jwt');

exports.signup = (req, res) => {
    const {name, email, password} = req.body;
    //check if user email already exists
    User.findOne({email : email})
        .exec()
        .then((result) => { 
            if (result){//user already exists, reject
                return res.status(400).json({
                    error: 'Email is taken'
                })
            } else {
                const username = nanoid();
                const profile = `${process.env.CLIENT_URL}/profile/${username}` //url for user
                const new_user = User({username, password, profile, email, name}) //ordering doesn't matter
                new_user.save()
                    .then((success) => {
                        res.json({
                            message : "Sign up success! Please sign in"
                            //user : success //for debugging
                        })
                    })
                    .catch((err) => {
                        return res.status(400).json({ //bad request
                            error: err
                        })
                    })                
                }
        })
        .catch((err) => {
            return res.status(400).json({ //bad request
                error: err
            })
        })
}

exports.signin = (req, res) => {
    const {email, password} = req.body;
    //check if user email exists
    User.findOne({email}) //shortcut of {email : email}
        .exec()
        .then((user) => { 
            if (!user){//user doesn't exists, reject
                return res.status(400).json({
                    error: 'Authentication failure'
                })
            //authentication fails
            } else if (!user.authenticate(password)) {
                return res.status(400).json({
                    error: 'Authentication failure'
                })
            //authentication succeeds, give jwt
            } else {
                //create jwt token
                const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
                //respond with a cookie containing the jwt token
                res.cookie('token', token, {expiresIn: '1d'});
                return res.json({
                    token,
                    user : {id : user._id, username : user.username, name : user.name, email : user.email, role : user.role}
                })
            }
        })
        .catch((err) => {
            logger.error(err);
            return res.status(400).json({ //bad request
                error: "Error encountered, please try again"
            })
        })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    return res.json({
        message : "Signout success - cookie cleared"
    })
}

//this is middleware, placed between the routes and the actual processing logic in the routes file
exports.require_sign_in = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})