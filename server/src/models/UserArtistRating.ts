// src/models/UserArtistRating.ts
import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IArtist } from './Artist';

export interface IUserArtistRating extends Document {
  user: mongoose.Types.ObjectId | IUser;
  artist: mongoose.Types.ObjectId | IArtist;
  rating: number;
  mustSee: boolean;
}

const userArtistRatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  mustSee: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const UserArtistRating = mongoose.model<IUserArtistRating>('UserArtistRating', userArtistRatingSchema);
