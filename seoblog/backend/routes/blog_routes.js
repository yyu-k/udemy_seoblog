const express = require('express');
const router = express.Router();
const blogControllers = require('../controllers/blog_controllers')

router.get('/', blogControllers.time)

module.exports = router;