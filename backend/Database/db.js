const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://shekarlee8688:xBtHEjZzzbfGZtJG@cluster0.9br7s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
};

module.exports = connectDB;
