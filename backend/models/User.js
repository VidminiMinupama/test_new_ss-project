// models/User.js
const mongoose = require('mongoose');
const { isEmail } = require('validator'); // Optional: to validate email format

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Please enter a valid email address'], // Optional: email validation
    },
    password: {
        type: String,
        required: true
    },
    // Note: Confirm Password is not stored in the database
});

// You may want to create a separate validation function for Confirm Password
// in your registration logic.

module.exports = mongoose.model('User', userSchema);
