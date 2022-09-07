const express = require('express');
const app = express();

require('dotenv').config();
require('express-async-errors');

const { mongoURI } = require('./config/config');

const dbConnection = require('./db/dbConnection');
const PORT = process.env.PORT || 8080;

const employeeRoute = require('./routes/employeeRoute');
const authRoute = require('./routes/authRoute');
const pageNotFoundRoute = require('./routes/pageNotFoundRoute');

app.use(express.json());
app.use('/api/v1/', authRoute);
app.use('/api/v1/employees/', employeeRoute);
app.use('*', pageNotFoundRoute);

const startServer = async () => {
    try {
        await dbConnection(mongoURI);
        console.log(`DB connection established`);
        app.listen(PORT, () => {
            console.log(`Server Listening on Port ${PORT}`);
        })
    }
    catch (error) {
        console.log(`Error Occured ${error}`);
    }
}

startServer();
