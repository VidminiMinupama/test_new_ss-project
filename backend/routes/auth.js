const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Register route with password validation and email verification
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 12 characters long, including uppercase, lowercase, number, and special character." 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false
        });

        await newUser.save();

        // Send verification email
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const verificationUrl = `http://localhost:${process.env.PORT}/api/auth/verify/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            text: `Please verify your account by clicking the link: ${verificationUrl}`
        });

        res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Email verification route
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

// Login route with verification check
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" });
        }

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
