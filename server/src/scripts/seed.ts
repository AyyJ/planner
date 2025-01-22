import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Artist, IArtist } from '../models/Artist';
import { User, IUser } from '../models/User';
import { UserArtistRating } from '../models/UserArtistRating';

dotenv.config();

const adminUser = await User.create({
  username: "admin",
  email: "admin@example.com",
  password: "admin123",
  isAdmin: true
});

seed();