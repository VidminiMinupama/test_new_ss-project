const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const uri = "mongodb+srv://vidmini_minupama:9pGiTN8UMNssQUBt@cluster0.9y8wl.mongodb.net/music_app?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); // To manage cookies securely

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const database = client.db("music_app");
    return database.collection("users"); // Return users collection
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

// Retrieve all users (for testing purposes; limit access in production)
app.get('/users', async (req, res) => {
  try {
    const usersCollection = await connectToDB();
    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).send("Error retrieving users: " + err.message);
  }
});

// Register new user with secure password hashing
app.post('/register', async (req, res) => {
  try {
    const usersCollection = await connectToDB();

    // Get password and confirmPassword from request body
    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user with hashed password
    const newUser = {
      username: username,
      email: email,
      password: hashedPassword, // Store only the hashed password
    };
    
    await usersCollection.insertOne(newUser);
    res.status(201).send("User registered securely.");
  } catch (err) {
    res.status(500).send("Error registering user: " + err.message);
  }
});

// Login user and issue JWT for session management
app.post('/login', async (req, res) => {
  try {
    const usersCollection = await connectToDB();
    
    // Find user by email
    const user = await usersCollection.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User not found.");

    // Compare input password with hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password.");

    // Generate JWT token for session management
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Set secure cookie with JWT token
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access to cookie
      secure: true,   // Ensures cookie is only sent over HTTPS
      sameSite: 'Strict' // Protects against CSRF attacks
    });
    res.send("Logged in securely.");
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

// Start the server and listen on 0.0.0.0
app.listen(3000, '0.0.0.0', () => { 
  console.log('Server is running on port 3000');
});
