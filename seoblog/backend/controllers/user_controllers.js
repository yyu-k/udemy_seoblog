const User = require('../models/user_model')

exports.read = (req, res) => {
    req.profile.hashed_password = undefined; //the profile is added in the authMiddleware of auth_controllers
    return res.json(req.profile);
};