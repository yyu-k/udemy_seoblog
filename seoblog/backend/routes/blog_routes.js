const express = require('express');
const router = express.Router();
const blogControllers = require('../controllers/blog_controllers');
const authControllers = require('../controllers/auth_controllers');

router.post('/blog/create',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.create);

module.exports = router;