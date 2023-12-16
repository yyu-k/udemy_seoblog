const {check} = require('express-validator');

exports.tag_create_validator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage("Name of tag is empty"),
]
