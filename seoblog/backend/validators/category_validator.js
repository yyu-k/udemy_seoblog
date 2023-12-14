const {check} = require('express-validator');

exports.category_create_validator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage("Name is empty"),
]
