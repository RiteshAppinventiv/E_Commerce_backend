const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    ratting: {
      type: Number,
      require: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    reviews: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
