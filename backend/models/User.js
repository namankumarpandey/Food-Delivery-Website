const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // removes extra spaces
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // always store in lowercase
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email"], // validation
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatically
  }
);

module.exports = mongoose.model("User", UserSchema);