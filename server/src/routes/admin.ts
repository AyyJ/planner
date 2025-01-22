// server/src/routes/admin.ts
import express, { Response, NextFunction } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { User, IUser } from '../models/User';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id) as IUser | null;
    if (user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error checking admin status' });
  }
};

// Get all users
router.get('/users', auth, isAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({})
      .select('-password')
      .populate('friends', 'username email');
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching users' });
  }
});

// Create new user
router.post('/users', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, isAdmin: isUserAdmin } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = new User({
      username,
      email,
      password,
      isAdmin: isUserAdmin
    });

    await user.save();
    
    // Return user without password
    const userWithoutPassword = await User.findById(user._id).select('-password');
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Update user
router.put('/users/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Prevent self-admin-removal
    if (req.params.id === req.user._id && !req.body.isAdmin) {
      return res.status(400).json({ error: 'Cannot remove admin status from yourself' });
    }

    const { username, email, isAdmin: isUserAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, isAdmin: isUserAdmin },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user' });
  }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // Double-check that the logged-in user is still an admin
    const adminUser = await User.findById(req.user._id);
    if (!adminUser?.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }

    // Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      return res.status(403).json({ error: 'Admin cannot delete their own account' });
    }

    // Check if target user is the last admin
    const targetUser = await User.findById(req.params.id);
    if (targetUser?.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      if (adminCount <= 1) {
        return res.status(403).json({ error: 'Cannot delete the last admin account' });
      }
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
