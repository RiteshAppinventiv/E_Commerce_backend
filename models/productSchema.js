const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },
    companyName:{
      type: String,
      require:true,
      trim:true,
    },
    originalPrice: {
      type: Number,
    },
    discountPercentage : {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    offers: {
      type: Array,
    },
    productPictures: {
      type: Array
    },
    Highlights:{
      type: Array
    },
    isHighlightShow:{
      type: Boolean
    },
    productType:{
      type:String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
