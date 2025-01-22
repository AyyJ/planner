import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};
