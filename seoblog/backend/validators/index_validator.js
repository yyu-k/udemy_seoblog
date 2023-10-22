const {validationResult} = require('express-validator');

exports.run_validation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422)
            .json({error: errors.array()[0].msg}); //send the first error message
    }
    next(); //let next event proceed
}