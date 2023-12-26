const express = require('express');
const router = express.Router();
const blogControllers = require('../controllers/blog_controllers');
const authControllers = require('../controllers/auth_controllers');

router.post('/blog/create',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.create);
router.get('/blog/list',
    blogControllers.list);
router.post('/blog/listBlogCatTag',
    blogControllers.listBlogCatTag);
router.get('/blog/:slug', 
    blogControllers.read);
router.get('/blog/photo/:slug',
    blogControllers.getPhoto)
router.delete('/blog/:slug',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.remove);
router.put('/blog/:slug',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.update);

module.exports = router;