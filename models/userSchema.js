const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
      trim: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [
      {
        name: {
          type: String,
        },
        address: {
          type: String,
        },
        pin: {
          type: Number,
        },
        phone: {
          type: Number,
        },
      },
    ],
    currentAddress: {
      name: {
        type: String,
      },
      address: {
        type: String,
      },
      pin: {
        type: Number,
      },
      phone: {
        type: Number,
      },
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        // price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Hash Password Directly from here.
userSchema.virtual("password").set(function (password) {
  this.hash_password = bcrypt.hashSync(password, 10);
});

//Getting FullName
// userSchema.virtual("fullName").get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

//Compare Hash Password.
userSchema.methods = {
  authentication: function (password) {
    return bcrypt.compareSync(password, this.hash_password);
  },
};

module.exports = mongoose.model("User", userSchema);
