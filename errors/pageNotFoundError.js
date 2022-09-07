const customAPIError = require('./customAPIError');
class pageNotFoundError extends customAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

module.exports = pageNotFoundError;
