const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();

let corsOptions;
if (process.env.CORS) {
    try {
        const origins = JSON.parse(process.env.CORS);
        corsOptions = {
            origin: origins,
            credentials: true,
            optionsSuccessStatus: 200
        };
    } catch (error) {
        corsOptions = {
            origin: process.env.CORS,
            credentials: true,
            optionsSuccessStatus: 200
        };
    }
} else {
    corsOptions = {
        origin: ['http://localhost:4200', 'https://google-arcade-guider.vercel.app'],
        credentials: true,
        optionsSuccessStatus: 200
    };
}

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', coursesRouter);

module.exports = app;
