const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const dealSchema = new mongoose.Schema(
  {
    categoryTitle: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    offerDetails: {
      type: String,
      required: true,
    },
    brandType: {
      type: String,
      required: true,
    },
    dealType:{
      type: String,
      default:""
      // required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Deal", dealSchema);
