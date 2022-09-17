const express = require('express');
const app = express();
const compression = require('compression');
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
const meetingRoute = require('./routes/meetingRoute');
const authRoute = require('./routes/authRoute');
const pageNotFoundRoute = require('./routes/pageNotFoundRoute');

const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS,GET,POST,PUT,PATCH,DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});


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

app.use(
    compression(
        (level = 6),
        (filter = (req, res) => {
            if (req.headers["no-x-compression"]) {
                return false;
            }
            return compression.filter(req, res);
        })
    )
);

app.use('/api/v1/', authRoute);
app.use('/api/v1/employees/', authenticate, employeeRoute);
app.use('/api/v1/meetings/', authenticate, meetingRoute);
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
