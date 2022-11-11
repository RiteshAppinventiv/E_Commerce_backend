require("dotenv").config();
const Deal = require("../models/dealSchema");
const Otp = require("../models/otpSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { mailManager } = require("../utils/mailManager");

const dealsController = {
  addProductDeals: async (req, res) => {
    try {
      const { categoryTitle, imageUrl, offerDetails, brandType, dealType } =
        req.body;
      const step1 = await Deal.findOne({
        categoryTitle: { $regex: `${categoryTitle}`, $options: "i" },
        dealType,
      });

      console.log("============================", step1);
      if (step1) {
        return res.status(409).json({
          statusCode: 409,
          message: `${categoryTitle} is Already Exists in ${dealType} deal category`,
        });
        // deals already added
      } else {
        // create new deals and add products

        const newDeals = new Deal({
          categoryTitle,
          imageUrl,
          offerDetails,
          brandType,
          dealType,
        });

        await newDeals.save();
      }

      res.status(200).json({
        message: "New Deals Added successfully",
        step1,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  getAllDeals: async (req, res) => {
    try {
      let pipeline = [];

      pipeline.push({
        $group: {
          _id: "$dealType",
          count: { $sum: 1 },
          products: {
            $addToSet: {
              _id: "$_id",
              categoryTitle: "$categoryTitle",
              imageUrl: "$imageUrl",
              offerDetails: "$offerDetails",
              brandType: "$brandType",
              dealType: "$dealType",
            },
          },
        },
      });

      const step1 = await Deal.aggregate(pipeline);
      res.status(200).json({
        message: "All Deals Get successfully",
        "data":step1,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const step1 = await Otp.findOne({ email });
      const user = await User.findOne({ email });
      if (!step1)
        return res.status(400).json({ message: "Invalid credentials" });

      if (step1) {
        if (otp == step1.otp) {
          const token = jwt.sign({ _id: user._id, role: user.role }, "ecom");

          const { _id, firstName, lastName, email, role, fullName } = user;
          await Otp.deleteOne({ email });
          await User.findOneAndUpdate({ email }, { isEmailVerified: true });
          return res.status(200).json({
            message: "otp verified successfully",
            token,
            statusCode: 200,
            user: { _id, firstName, lastName, email, role, fullName },
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Invalid credentials", statusCode: 400 });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user)
        return res.status(200).json({ message: "Email Not Regestered Yet" });

      // const isMatch = await bcrypt.compare(password, user.password);
      if (user) {
        if (!user.isEmailVerified) {
          const otp = "1234";
          // console.log("-----------------------------")
          console.log("email", email, " has otp: ", otp);
          mailManager.verifyEmail({ email: email, otp });
          console.log("mail sent");
          const newOtp = new Otp({
            email,
            otp,
          });
          await newOtp.save();

          return res
            .status(201)
            .json({ message: "Email not verifyed", statusCode: 201 });
        }
        if (user.authentication(password)) {
          const token = jwt.sign({ _id: user._id, role: user.role }, "ecom");

          const { _id, name, role } = user;
          res.status(200).json({
            message: "Login successfully",
            token,
            statusCode: 200,
            user: { _id, name, email, role },
          });
        } else {
          res.status(200).json({
            message: "Invalid username or password",
            statusCode: 401,
          });
        }
      } else {
        console.log("errreer");
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // const accessToken = createAccessToken({ id: user._id });
      // const refreshtoken = createRefreshToken({ id: user._id });
      // console.log(accessToken, refreshtoken, "tokensss");

      // res.cookie("refreshtoken", refreshtoken, {
      //   httpOnly: true,
      //   path: "/user/refresh_token",
      // });
      // console.log(req.cookies, "cookie");
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = dealsController;
