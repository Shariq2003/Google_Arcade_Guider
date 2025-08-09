const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();
app.use(cors("*"));

app.use(express.json());
app.use('/api', coursesRouter);

module.exports = app;
