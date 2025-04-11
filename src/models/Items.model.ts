import mongoose, { Schema, models } from 'mongoose';

// Define the interface for the Item document
// interface IItem extends Document {
//   user: mongoose.Types.ObjectId; // Reference to User model
//   adTitle: string;
//   description: string;
//   price: number;
//   name: string;
//   phoneNumber: string;
//   currency: string;
//   category: string;
//   street?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   postalCode?: string;
//   image1?: string; // Store as URL or path
//   image2?: string;
//   image3?: string;
//   specifications?: Record<string, any>; // JSON-like structure
//   keywords?: string;
//   createdAt: Date;
// }

// Define the schema
const itemSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    adTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number, // Using Number instead of DecimalField for simplicity
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    currency: {
      type: String,
      default: 'PKR',
      trim: true,
      maxlength: 10,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    street: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    city: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    state: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    image1: {
      type: String, // Store as URL or path
    },
    image2: {
      type: String,
    },
    image3: {
      type: String,
    },
    specifications: {
      type: Map, // Use Map for JSON-like flexibility
      default: {},
    },
    keywords: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create and export the model
const Item = models.Item || mongoose.model('Item', itemSchema);

export default Item;
