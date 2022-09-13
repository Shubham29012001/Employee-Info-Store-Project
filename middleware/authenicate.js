const jwt = require('jsonwebtoken');
const { badRequestError, unauthenticateError } = require('../errors/')
const { jwtSecret, accessTokenLife } = require('../config/config');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new unauthenticateError("No Authorization Token");
    }

    const accessToken = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(accessToken, jwtSecret);
        req.user = { userId: payload.userId, name: payload.name, userType: payload.userType, email: payload.email };
        next();
    }
    catch (error) {
        throw new unauthenticateError("Authorization Error");
    }
};

module.exports = {
    authenticate
}