const express = require('express');
const Course = require('../Models/CourseMaster');
const { route } = require('./auth');
const router = express.Router();


router.post('/', async (req, res) => {
    const { course } = req.body;
    if (!course) {
        return res.status(400).json({ message: 'course are required' });
    }

    try {
        const isexist = await Course.findOne({ course });
        if (!isexist) {
            const newcourse = new Course({course});
            const savedCourse = await newcourse.save();
            const courses = await Course.find();
            return res.status(200).json({
                message: 'Course created successfully',
                courses: courses,
            });
        }

        else{
            return res.status(201).json({
                message: 'Course already exists',
            });
        }
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/',async (req, res) => {
    try{
    const courses = await Course.find();
    return res.status(200).json({
        message: 'Courses fetched',
        courses: courses,
    });
    }
    catch(e){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await Course.findByIdAndDelete(id);
        if (!deletedEmployee) return res.status(201).json({ message: 'Course not found' });
        const courses = await Course.find();
        res.json({ message: 'Course deleted successfully' ,courses: courses});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { course } = req.body;

    try {

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { course }, 
            { new: true } 
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

    
        const courses = await Course.find();
        res.json({ message: 'Course updated', courses });
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error });
    }
});


module.exports = router;
