const express = require('express');
const router = express.Router();
const blogControllers = require('../controllers/blog_controllers');
const authControllers = require('../controllers/auth_controllers');

router.get('/blog/list',
    blogControllers.list);
router.post('/blog/listBlogCatTag',
    blogControllers.listBlogCatTag);
router.get('/blog/search',
    blogControllers.listSearch);
router.get('/blog/:slug', 
    blogControllers.read);
router.get('/blog/photo/:slug',
    blogControllers.getPhoto)
router.post('/blog/related',
    blogControllers.listRelated);

//admin
router.post('/blog/create',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.create);
router.delete('/blog/:slug',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.remove);
router.put('/blog/:slug',
    authControllers.require_sign_in,
    authControllers.adminMiddleware,
    blogControllers.update);

//auth.user.blog.crud
router.post('/user/blog/create',
    authControllers.require_sign_in,
    authControllers.authMiddleware,
    blogControllers.create);
router.delete('/user/blog/:slug',
    authControllers.require_sign_in,
    authControllers.authMiddleware,
    authControllers.canUpdateDeleteBlog,
    blogControllers.remove);
router.put('/user/blog/:slug',
    authControllers.require_sign_in,
    authControllers.authMiddleware,
    authControllers.canUpdateDeleteBlog,
    blogControllers.update);
router.get('/:username/blogs',
    blogControllers.listForUser);


module.exports = router;