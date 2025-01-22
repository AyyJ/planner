import express from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import { Artist, IArtist } from '../models/Artist';
import { UserArtistRating, IUserArtistRating } from '../models/UserArtistRating';
import { User } from '../models/User';
import mongoose, { Document } from 'mongoose';

const router = express.Router();

// Get all artists with user's ratings AND friend data
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const artists = await Artist.find().lean();
    const user = await User.findById(req.user._id);
    
    // Get user's own ratings
    const userRatings = await UserArtistRating.find({ 
      user: req.user._id 
    }).lean() as Array<IUserArtistRating>;
    
    // Get all friend ratings in one query
    const friendRatings = await UserArtistRating.find({
      user: { $in: user?.friends },
      rating: { $gte: 4 } // Only get high ratings (4 or 5 stars)
    }).populate('user', 'username').lean();

    // Group friend ratings by artist
    const friendRatingsByArtist = friendRatings.reduce((acc, rating) => {
      const artistId = (rating.artist as mongoose.Types.ObjectId).toString();
      if (!acc[artistId]) {
        acc[artistId] = [];
      }
      acc[artistId].push({
        username: (rating.user as any).username,
        rating: rating.rating
      });
      return acc;
    }, {} as Record<string, Array<{ username: string; rating: number }>>);
    
    const artistsWithRatings = artists.map((artist) => {
      const userRating = userRatings.find(rating => 
        (rating.artist as mongoose.Types.ObjectId).toString() === artist._id.toString()
      );
      
      return {
        ...artist,
        rating: userRating?.rating || 0,
        mustSee: userRating?.mustSee || false,
        friendOverlap: friendRatingsByArtist[artist._id.toString()] || []
      };
    });

    res.json(artistsWithRatings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching artists' });
  }
});

// Update artist rating
router.post('/:artistId/rate', auth, async (req: AuthRequest, res) => {
  try {
    const { rating, mustSee } = req.body;
    const { artistId } = req.params;

    const userRating = await UserArtistRating.findOneAndUpdate(
      { user: req.user._id, artist: artistId },
      { rating, mustSee },
      { upsert: true, new: true }
    );

    res.json(userRating);
  } catch (error) {
    res.status(400).json({ error: 'Error updating rating' });
  }
});

// Get detailed friend ratings for an artist
router.get('/:artistId/friend-ratings', auth, async (req: AuthRequest, res) => {
  try {
    const { artistId } = req.params;
    const user = await User.findById(req.user._id);
    
    const friendRatings = await UserArtistRating.find({
      artist: artistId,
      user: { $in: user?.friends }
    }).populate('user', 'username');

    const formattedRatings = friendRatings.map(rating => ({
      username: (rating.user as any).username,
      rating: rating.rating,
      mustSee: rating.mustSee
    }));

    res.json(formattedRatings);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching friend ratings' });
  }
});

export default router;
