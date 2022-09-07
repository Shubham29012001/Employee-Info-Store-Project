const customAPIError = require('./customAPIError');
const unauthenticateError = require('./unauthenticateError');
const badRequestError = require('./badRequestError');
const pageNotFoundError = require('./pageNotFoundError');

module.exports = {
    customAPIError,
    unauthenticateError,
    badRequestError,
    pageNotFoundError,
}