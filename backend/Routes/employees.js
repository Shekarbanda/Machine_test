const express = require('express');
const Employee = require('../Models/Employee'); // Ensure the correct path to your Employee model
const router = express.Router();
const multer = require('multer');
const path = require('path');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);
const MAX_IMAGE_SIZE = 50000 * 1024 * 1024;

// Create a new employee
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Uploaded_Images/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
  
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Invalid file type. Only PNG and JPG are allowed.'), false);
    }
  };

// Multer instance with limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // Limit: 5 MB
});

// Route to create a new employee
router.post('/', (req, res) => {
    upload.single('image')(req, res, async (err) => {
        const { name, email, mobile, designation, gender, course } = req.body;

        try {
            // Handle Multer errors
            if (err instanceof multer.MulterError) {
                return res.status(201).json({ message: 'File upload error', error: err.message });
            }
            if (err) {
                return res.status(201).json({ message: err.message });
            }

            // Validate required fields
            if (!name || !email || !mobile || !designation || !gender || !course) {
                return res.status(201).json({ message: 'All fields are required' });
            }

            // Validate email format
            if (!isValidEmail(email)) {
                return res.status(201).json({ message: 'Invalid email format' });
            }

            // Validate mobile format
            if (!isValidMobile(mobile)) {
                return res.status(201).json({ message: 'Invalid mobile number format' });
            }

            // Check for duplicate email
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                return res.status(201).json({ message: 'Email already exists' });
            }

            // Create a new employee object
            const newEmployee = new Employee({
                name,
                email,
                mobile,
                designation,
                gender,
                course,
                image: req.file ? req.file.path : null, // Store file path if image exists
            });

            // Save to database
            const savedEmployee = await newEmployee.save();

            return res.status(200).json({
                message: 'Employee created successfully',
                employee: savedEmployee,
            });
        } 
        catch (error) {
            // Handle unexpected errors
            return res.status(500).json({
                message: 'An unexpected error occurred',
                error: error.message,
            });
        }
    });
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


// Update employee route with image handling
router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, designation, gender, course } = req.body;
    let image = req.file ? req.file.path : null; // Get the image path if file is uploaded

    try {
        // Fetch the employee's current data
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Prepare the update object, only updating fields that have changed
        const updatedData = {};

        if (name && name !== employee.name) updatedData.name = name;
        if (email && email !== employee.email) updatedData.email = email;
        if (mobile && mobile !== employee.mobile) updatedData.mobile = mobile;
        if (designation && designation !== employee.designation) updatedData.designation = designation;
        if (gender && gender !== employee.gender) updatedData.gender = gender;
         if (course) {
            updatedData.course = course; 
          }

        // If a new image is uploaded, update the image field
        if (image && image !== employee.image) updatedData.image = image;

        // If no fields are updated, return a message
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        // Update the employee with the new data
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });



        if (!updatedEmployee) {
            return res.status(201).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        console.error('Error updating employee:', error);
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
