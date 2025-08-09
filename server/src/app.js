const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();
app.use(cors(process.env.CORS));
// The above statement allows requests from the specified origins
app.use(express.json());
app.use('/api', coursesRouter);

module.exports = app;
