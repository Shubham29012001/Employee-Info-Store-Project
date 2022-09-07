const customAPIError = require('./customAPIError');
class UnauthenticatedError extends customAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}

module.exports = UnauthenticatedError;
