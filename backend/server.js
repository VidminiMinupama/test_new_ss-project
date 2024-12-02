const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB connection error:", error));

// Routes
app.use('/api/auth', authRoutes);

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the front-end


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
