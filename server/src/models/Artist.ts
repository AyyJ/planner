import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  genre: string;
  day: "Friday" | "Saturday" | "Sunday";
  startTime: string;
  endTime: string;
  stage: string;
  imageUrl?: string;
}

const artistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    required: true
  },
  imageUrl: String
});

export const Artist = mongoose.model<IArtist>('Artist', artistSchema);
