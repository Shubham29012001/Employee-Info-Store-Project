const customAPIError = require('./customAPIError');

class badRequestError extends customAPIError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

module.exports = badRequestError;
