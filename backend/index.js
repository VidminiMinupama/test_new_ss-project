// index.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const app = express();

// MongoDB Connection
const dbURI = 'mongodb+srv://yourUsername:yourPassword@yourCluster.mongodb.net/music_website_db?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
        // Start the server only after successful connection
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
    

// Middleware
app.use(bodyParser.json());
app.use('/api', userRoutes); // Use routes with a prefix
