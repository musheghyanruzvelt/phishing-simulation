import * as mongoose from 'mongoose';

export interface User {
  id?: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export const UserSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  },
);

UserSchema.index({ email: 1 }, { unique: true });
