const express = require('express');
const router = express.Router();
const commentControllers = require('../controllers/comment_controllers')
const authControllers = require('../controllers/auth_controllers');

router.post('/comment/create', 
    authControllers.require_sign_in,
    commentControllers.create);

router.post('/comment/get/:slug', 
    commentControllers.get);

module.exports = router;