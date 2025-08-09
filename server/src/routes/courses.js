const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/coursesController');

router.post('/sort-courses', upload.single('file'), controller.sortCourses);

module.exports = router;
