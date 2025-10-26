import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  _id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
    twitter?: string;
  };
  works: number;
  isActive: boolean;
  userId?: string; // Reference to User if artist is also a user
  createdAt: Date;
  updatedAt: Date;
}

const socialLinksSchema = new Schema({
  instagram: String,
  facebook: String,
  website: String,
  twitter: String,
}, { _id: false });

const artistSchema = new Schema<IArtist>({
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    maxlength: [100, 'Artist name cannot exceed 100 characters'],
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    trim: true,
    maxlength: [100, 'Specialty cannot exceed 100 characters'],
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [2000, 'Bio cannot exceed 2000 characters'],
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is required'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'],
  },
  socialLinks: socialLinksSchema,
  works: {
    type: Number,
    default: 0,
    min: [0, 'Works count cannot be negative'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true, // Allow null values but ensure uniqueness when present
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better query performance
artistSchema.index({ name: 1 });
artistSchema.index({ specialty: 1 });
artistSchema.index({ isActive: 1 });
artistSchema.index({ createdAt: -1 });
artistSchema.index({ userId: 1 }, { sparse: true });

// Text index for search functionality
artistSchema.index({
  name: 'text',
  specialty: 'text',
  bio: 'text',
});

export const Artist = mongoose.model<IArtist>('Artist', artistSchema);
