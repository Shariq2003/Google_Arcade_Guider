const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();

// Configure CORS with specific options
const corsOptions = {
    origin: [
        'https://google-arcade-guider.vercel.app',
        'http://localhost:3000', // for local development
        'http://localhost:5173', // for Vite dev server
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if you need to send cookies
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/api', coursesRouter);

// Add a health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;