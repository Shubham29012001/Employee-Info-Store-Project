const mongoose = require('mongoose');

const dbConnection = async (url) => {
    return mongoose.connect((url), { useNewUrlParser: true })
}

module.exports = dbConnection;