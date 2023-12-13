const express = require('express');
const router = express.Router();
const auth_controllers = require('../controllers/auth_controllers')
const user_controllers = require('../controllers/user_controllers')

router.get('/profile', auth_controllers.require_sign_in, 
    auth_controllers.authMiddleware,
    user_controllers.read);

module.exports = router;