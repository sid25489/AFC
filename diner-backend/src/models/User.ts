import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

/** User roles */
export enum UserRole {
  ADMIN = "admin",
  STAFF = "staff",
  CUSTOMER = "customer",
}

export interface IUser extends Document {
  email: string;
  password?: string; // Optional for Google OAuth users
  googleId?: string; // Google OAuth ID
  role: UserRole; // ✅ use enum
  name: string;
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string; // Token for password reset
  resetPasswordExpire?: Date; // Expiration for reset token
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Optional for Google OAuth users
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values with unique constraint
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    role: {
      type: String,
      enum: Object.values(UserRole), // ✅ synced
      default: UserRole.CUSTOMER,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

// password hash
UserSchema.pre("save", async function (next) {
  // Skip hashing if password is not modified or not present (Google OAuth)
  if (!this.password || !this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
