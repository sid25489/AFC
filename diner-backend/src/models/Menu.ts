import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isKids?: boolean;
  isAvailable: boolean;
  happyHourPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Breakfast",
        "Brunch",
        "Lunch",
        "Dinner",
        "Coffee & Drinks",
        "Cocktails, Beer, Wine",
        "Vegetarian & Healthy Options",
        "Kids Menu",
      ],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    isKids: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    happyHourPrice: {
      type: Number,
      min: [0, "Happy hour price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

