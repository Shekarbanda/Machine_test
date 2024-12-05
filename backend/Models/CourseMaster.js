const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    course: { type: String, required: true }
});

module.exports = mongoose.model('coursemaster', CourseSchema);
