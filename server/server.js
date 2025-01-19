const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const User = require('./models/User');
const Artist = require('./models/Artist');
const cors = require('cors');


const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());

// JWT Secret (in production, this should be in environment variables)
const JWT_SECRET = 'your-secret-key';

// Auth middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Auth Routes
app.post('/api/v1/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            artistPreferences: {}
        });

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                artistPreferences: user.artistPreferences
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/v1/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                artistPreferences: user.artistPreferences
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Artist Routes
app.get('/api/v1/artists', authenticateToken, async (req, res) => {
    try {
        const artists = await Artist.find({}, {
            _id: 1,          // Include MongoDB _id
            name: 1,
            imageURL: 1,
            genre: 1,
            stage: 1
        });

        // Transform data to match Swift model
        const formattedArtists = artists.map(artist => ({
            id: artist._id.toString(),  // Convert MongoDB _id to string
            name: artist.name,
            imageURL: artist.imageURL,
            genre: artist.genre,
            stage: artist.stage
        }));

        res.json(formattedArtists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/v1/artists/:artistId/preference', authenticateToken, async (req, res) => {
    try {
        const { artistId } = req.params;
        const { interestLevel } = req.body;

        // Verify artist exists
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Update user preferences
        const user = req.user;
        user.artistPreferences.set(artistId, interestLevel);
        await user.save();

        res.json({
            id: user._id,
            username: user.username,
            artistPreferences: Object.fromEntries(user.artistPreferences)
        });
    } catch (error) {
        console.error('Error updating preference:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});