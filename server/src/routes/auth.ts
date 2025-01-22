import express from 'express';
import { User, IUser } from '../models/User';
import { generateToken } from '../utils/tokens';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();
    
    const token = generateToken(user);
    // Send user data without password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      friends: user.friends
    };
    
    res.status(201).json({ user: userData, token });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }) as IUser | null;
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = generateToken(user);
    
    // Send user data without password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      friends: user.friends
    };

    res.json({ user: userData, token });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' });
  }
});

export default router;
