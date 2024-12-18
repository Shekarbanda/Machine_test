const express = require('express');
const cors = require('cors');
const connectDB = require('./Database/db');
const authRoutes = require('./Routes/auth');
const employeeRoutes = require('./Routes/employees');
const courserouter = require('./Routes/course')
const path = require('path')

const app = express();
connectDB();
app.use(
    cors({
        origin: 'https://employee-management-system-frontend-15su.onrender.com',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.json({ limit: 'Infinity' }));

app.use('/Uploaded_Images', express.static(path.join(__dirname, 'Uploaded_Images')));
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/coursemaster',courserouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

