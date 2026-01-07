import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { TUser, TUserMethods, UserModel } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel, TUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// Instance method to compare passwords
userSchema.methods.isPasswordMatched = async function (
  plainPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

export const User = model<TUser, UserModel>('User', userSchema);
