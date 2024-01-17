const express = require('express');
const router = express.Router();
const form_controllers = require('../controllers/form_controllers');

//validators
const { run_validation } = require('../validators/index_validator')
const form_validators = require('../validators/form_validator');

router.post('/contact', 
    form_validators.contactFormValidator,
    run_validation,
    form_controllers.contactForm);

module.exports = router;

