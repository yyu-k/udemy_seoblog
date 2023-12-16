const express = require('express');
const router = express.Router();
const auth_controllers = require('../controllers/auth_controllers');
const category_controllers = require('../controllers/category_controllers');
const {category_create_validator} = require('../validators/category_validator');
const { run_validation } = require('../validators/index_validator');

router.post('/category/create', 
    category_create_validator,
    run_validation,
    auth_controllers.require_sign_in, 
    auth_controllers.adminMiddleware,
    category_controllers.create);

router.get('/category/list', category_controllers.list)
router.get('/category/:slug', category_controllers.read)

router.delete('/category/:slug',
    auth_controllers.require_sign_in,
    auth_controllers.adminMiddleware,
    category_controllers.remove)

module.exports = router;