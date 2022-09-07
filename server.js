const express = require('express');
const app = express();

require('dotenv').config();
require('express-async-errors');

const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');

const { mongoURI } = require('./config/config');

const dbConnection = require('./db/dbConnection');
const PORT = process.env.PORT || 8080;

const { authenticate } = require('./middleware/authenicate');

const employeeRoute = require('./routes/employeeRoute');
const authRoute = require('./routes/authRoute');
const pageNotFoundRoute = require('./routes/pageNotFoundRoute');

const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');

app.use(rateLimiter(
    {
        windowMs: 20 * 60 * 1000,
        max: 200
    }
))
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());

app.use('/api/v1/', authRoute);
app.use('/api/v1/employees/', authenticate, employeeRoute);
app.use('*', pageNotFoundRoute);

app.use(errorHandlerMiddleware);

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
