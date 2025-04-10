import { Schema, model, models } from 'mongoose';

// Define the interface for the User document
// interface IUser extends Document {
//   email: string;
//   username?: string;
//   firstName: string;
//   lastName: string;
//   phoneNo?: string;
//   photo?: string; // Store as URL or path
//   city?: string;
//   country?: string;
//   about?: string;
//   gender?: 'Male' | 'Female' | 'Other';
//   dateOfBirth?: Date;
//   role: 'admin' | 'user';
//   isActive: boolean;
//   isStaff: boolean;
//   password: string; // Hashed password
// }

// Define the schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: false,
      trim: true,
    },
    photo: {
      type: String, // Store as a URL or path to the image
      required: false,
      default: '/profilePictures/profile.png',
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    country: {
      type: String,
      required: false,
      default: 'Pakistan',
      trim: true,
    },
    about: {
      type: String,
      required: false,
      maxlength: 1024,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true, // Hashed password will be stored here
    },
  },
  {
    collection: 'users',
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the model
const User = models.User || model('User', userSchema);

export default User;
