const {check} = require('express-validator');
const { CONSTANTS } = require('../CONSTANTS')

exports.user_signup_validator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage("Name is empty"),
    check('email')
        .isEmail()
        .withMessage('Invalid email address provided'),
    check('password')
        .isLength({min : CONSTANTS.min_password_length})
        .withMessage(`Password does not meet minimum required length of ${CONSTANTS.min_password_length}`)
]

exports.user_signin_validator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address provided'),
    check('password')
        .isLength({min : CONSTANTS.min_password_length})
        .withMessage(`Password does not meet minimum required length of ${CONSTANTS.min_password_length}`)
]

exports.forgetPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address provided'),
];

exports.resetPasswordValidator = [
    check('resetPasswordLink')
        .not()
        .isEmpty()
        .isJWT()
        .withMessage(`Something has gone wrong with the reset password link`),
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({min : CONSTANTS.min_password_length})
        .withMessage(`Password does not meet minimum required length of ${CONSTANTS.min_password_length}`)
];
