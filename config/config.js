// MongoDB URI
exports.mongoURI = process.env.MONGO_URI;

// JWT Tokens & Secret
exports.jwtSecret = process.env.JWT_SECRET;
exports.accessToken = process.env.ACCESS_TOKEN_SECRET;
exports.refreshToken = process.env.REFRESH_TOKEN_SECRET;

// JWT Expiration Lifespan
exports.accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
exports.refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;