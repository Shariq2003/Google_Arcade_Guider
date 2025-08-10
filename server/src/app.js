const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();

app.use(cors({
    origin: [
        'https://google-arcade-guider.vercel.app',
        'http://localhost:4200'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api', coursesRouter);

module.exports = app;
