const express = require('express');
const router = express.Router();
const auth_controllers = require('../controllers/auth_controllers')
const user_controllers = require('../controllers/user_controllers')

router.get('/user/profile', auth_controllers.require_sign_in, 
    auth_controllers.authMiddleware,
    user_controllers.read);

router.get('/user/:username', 
    user_controllers.publicProfile);

router.put('/user/update',
    auth_controllers.require_sign_in,
    auth_controllers.authMiddleware,
    user_controllers.update)

router.get('/user/photo/:username', 
    user_controllers.photo)

module.exports = router;