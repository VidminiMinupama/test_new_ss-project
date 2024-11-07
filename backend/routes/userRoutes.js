// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    
    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
});

module.exports = router;
