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
        user : req.auth
    })
})
router.put('/forgot-password', 
    auth_validators.forgetPasswordValidator,
    run_validation,
    auth_controllers.forgotPassword)
router.put('/reset-password', 
    auth_validators.resetPasswordValidator,
    run_validation,
    auth_controllers.resetPasswordMiddleware,
    auth_controllers.resetPassword)


module.exports = router;