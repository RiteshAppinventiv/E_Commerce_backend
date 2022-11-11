const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// otpSchema.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 300 } )
otpSchema.index( { "updatedAt": 1 }, { expireAfterSeconds: 300 } );

module.exports = mongoose.model("Otp", otpSchema);
