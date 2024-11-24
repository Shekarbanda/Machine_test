const express = require('express');
const User = require('../Models/Admin');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(201).json({ message: 'User does not exist' }); 
        }

        if (user.password !== password) {
            return res.status(201).json({ message: 'Incorrect password' }); 
        }

        res.json({ message: 'Login successful', username: user.username });
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;
