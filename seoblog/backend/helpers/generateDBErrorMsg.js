const { logger } = require("../backend_logger")

exports.generateDBErrorMsg = (err) => {
    let errorMsg;
    switch(err.code) {
        case 11000:
        case 11001:
            errorMsg = 'Duplicates Error - Relevant Document Already Exists in DB';
            break;
        default:
            errorMsg = 'Something has gone wrong with the database operation';
    }
    logger.error(err.message);
    return `Error ${err.code}: ${errorMsg}`;
}
