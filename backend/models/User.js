import mongoose from "mongoose";

// Matches the existing documents in the "test" database's "users" collection:
// _id, name, email, provider, avatar, createdAt, __v
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    provider: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Explicitly bind to the existing "users" collection
const User = mongoose.model("User", userSchema, "users");

export default User;
