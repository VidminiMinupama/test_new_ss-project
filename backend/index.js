const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// Rate Limiting Middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per IP
  message: 'Too many login attempts, please try again later.',
});

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

// Enforce password policies
function checkPasswordStrength(password) {
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
  return strongPasswordRegex.test(password);
}

// Send Email for Verification (e.g., after registration)
async function sendVerificationEmail(userEmail, verificationToken) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Replace with your email
      pass: 'your-email-password', // Replace with your email password
    },
  });

  const verificationLink = `http://your-domain.com/verify-email?token=${verificationToken}`;

  await transporter.sendMail({
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Verify Your Email',
    text: `Please verify your email address by clicking the following link: ${verificationLink}`,
  });
}

// Register new user with secure password hashing and email verification
app.post('/register', async (req, res) => {
  try {
    const usersCollection = await connectToDB();

    const { username, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match.");
    }

    // Check password strength
    if (!checkPasswordStrength(password)) {
      return res.status(400).send("Password must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters.");
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Store user with hashed password and verification token
    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
      verificationToken: verificationToken, // Store verification token
    };

    await usersCollection.insertOne(newUser);

    // Send email verification link
    await sendVerificationEmail(email, verificationToken);

    res.status(201).send("User registered. Please check your email to verify your account.");
  } catch (err) {
    res.status(500).send("Error registering user: " + err.message);
  }
});

// Login user and issue JWT for session management
app.post('/login', loginLimiter, async (req, res) => {
  try {
    const usersCollection = await connectToDB();
    const { email, password } = req.body;

    // Find user by email
    const user = await usersCollection.findOne({ email: email });
    if (!user) return res.status(400).send("User not found.");

    // Check if account is verified
    if (!user.verificationToken) {
      return res.status(400).send("Please verify your email first.");
    }

    // Compare input password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password.");

    // Generate JWT token for session management
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    // Set secure cookie with JWT token
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access to cookie
      secure: true,   // Ensures cookie is only sent over HTTPS
      sameSite: 'Strict', // Protects against CSRF attacks
    });

    res.send("Logged in securely.");
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

// Start the server and listen on 0.0.0.0
app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});