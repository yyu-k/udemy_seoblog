const express = require('express');
const router = express.Router();
const auth_controllers = require('../controllers/auth_controllers')

//validator
const auth_validators = require('../validators/auth_validator')
const {run_validation} = require('../validators/index_validator')

router.post('/signup', auth_validators.user_signup_validator, run_validation, auth_controllers.signup)
router.post('/signin', auth_validators.user_signin_validator, run_validation, auth_controllers.signin)
router.get('/signout', auth_controllers.signout);
//test for varifying jwt was signed with secret, using express-jwt middleware
router.get('/secret', auth_controllers.require_sign_in, (req, res) => {
    return res.json({
        message: 'you have accessed a page that only a logged in individual with the correct JWT should be able to!'
    })
})

module.exports = router;