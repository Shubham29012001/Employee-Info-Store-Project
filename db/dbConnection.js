const mongoose = require('mongoose');

const dbConnection = async (url) => {
    return mongoose.connect((url), { useNewUrlParser: true, useUnifiedTopology: true })
}

module.exports = dbConnection;