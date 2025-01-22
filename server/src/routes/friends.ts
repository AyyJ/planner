import express from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = express.Router();

router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'username email');
    res.json(user?.friends);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching friends' });
  }
});

router.post('/add', auth, async (req: AuthRequest, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user?.friends.includes(friendId)) {
      user?.friends.push(friendId);
      await user?.save();
    }

    res.json(user?.friends);
  } catch (error) {
    res.status(400).json({ error: 'Error adding friend' });
  }
});

export default router;
