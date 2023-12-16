const express = require('express');
const router = express.Router();
const auth_controllers = require('../controllers/auth_controllers.js');
const tag_controllers = require('../controllers/tag_controllers.js');
const { tag_create_validator } = require('../validators/tag_validator.js')
const { run_validation } = require('../validators/index_validator.js');

router.post('/tag/create', 
    tag_create_validator,
    run_validation,
    auth_controllers.require_sign_in, 
    auth_controllers.adminMiddleware,
    tag_controllers.create);

router.get('/tag/list', tag_controllers.list)
router.get('/tag/:slug', tag_controllers.read)

router.delete('/tag/:slug',
    auth_controllers.require_sign_in,
    auth_controllers.adminMiddleware,
    tag_controllers.remove)

module.exports = router;