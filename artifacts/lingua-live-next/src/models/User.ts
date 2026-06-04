import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  subscription: "free" | "basic" | "premium" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    subscription: { type: String, enum: ["free", "basic", "premium", "enterprise"], default: "free" },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
