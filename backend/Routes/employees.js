const express = require('express');
const Employee = require('../Models/Employee'); // Ensure the correct path to your Employee model
const router = express.Router();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Create a new employee
router.post('/', async (req, res) => {
    const { name, email, mobile, designation, gender, course, image } = req.body;

    //checks for all fields are required
    if (!name || !email || !mobile || !designation || !gender || !course || !image) {
        return res.status(201).json({ message: 'All fields, including the image, are required' });
    }

    // Validate email and mobile format
    if (!isValidEmail(email)) {
        return res.status(201).json({ message: 'Invalid email format' });
    }
    if (!isValidMobile(mobile)) {
        return res.status(201).json({ message: 'Invalid mobile number format' });
    }

    const imageSizeInBytes = Buffer.from(image, 'base64').length;

    if (imageSizeInBytes > MAX_IMAGE_SIZE) {
        return res.status(201).json({ message: 'Image size exceeds the maximum limit of 10MB.' });
    }

    // Check if email already exists
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
        return res.status(201).json({ message: 'Email already exists' });
    }

    try {
        const newEmployee = new Employee({
            name,
            email,
            mobile,
            designation,
            gender,
            course,
            image,
        });

        await newEmployee.save(); // Save the employee document
        res.status(200).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
});


//searching and sorting
router.get('/', async (req, res) => {
    const { search = '', page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;

    const query = search
        ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
            ],
        }
        : {};

    const sortOrder = order === 'desc' ? -1 : 1;

    try {
        const employees = await Employee.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalCount = await Employee.countDocuments(query);
        res.json({
            employees,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
});



// getting data to edit
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(201).json({ message: 'Employee not found' });
        }
        res.json({ employee });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error });
    }
});

//update emp data
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, designation, gender, course, image } = req.body;

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { name, email, mobile, designation, gender, course, image },
            { new: true } // Return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
    }
});

// Update employee active/inactive status
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const employee = await Employee.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee status updated', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) return res.status(201).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});

module.exports = router;
