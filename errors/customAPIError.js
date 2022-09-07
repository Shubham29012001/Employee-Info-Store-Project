class customAPIError extends Error {
    constructor(message) {
        super(message)
    }
}

module.exports = customAPIError;
