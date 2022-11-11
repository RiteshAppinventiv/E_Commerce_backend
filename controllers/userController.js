require("dotenv").config();
const User = require("../models/userSchema");
const Otp = require("../models/otpSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { mailManager } = require("../utils/mailManager");

const userCtrl = {
  signUp: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // console.log(firstName, lastName, email, password)
      const user = await User.findOne({ email });
      console.log(user);
      console.log("helllow  ");
      if (user) {
        return res
          .status(200)
          .json({ message: "User already registered", statusCode: 400 });
      }
      if (password.length < 6) {
        return res
          .status(200)
          .json({ message: "Password is at least 6 characters" });
      }

      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();

      // const otp = getRandomOtp(4).toString();
      const otp = Math.floor(1000 + Math.random() * 9000);
      // console.log("-----------------------------")
      console.log("email", email, " has otp: ", otp);
      mailManager.verifyEmail({ email: email, otp });
      console.log("mail sent");
      console.log("---------------", email, otp);
      const newOtp = new Otp({
        email,
        otp,
      });
      await newOtp.save();

      res
        .status(200)
        .json({
          message: "Registration successfully",
          newUser,
          statusCode: 200,
        });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      console.log("otpVerify API request");
      const step1 = await Otp.findOne({ email });
      const user = await User.findOne({ email });
      console.log(step1);
      if (!step1 || !user) {
        console.log("invalid otp")
        return res.status(400).json({ message: "Invalid credentials" });

      }
        
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
        return res
          .status(200)
          .json({ message: "Invalid otp", statusCode: 400 });
      } else {
        return res
          .status(200)
          .json({ message: "Invalid otp", statusCode: 400 });
      }
    } catch (err) {
      return res.status(200).json({ message: err.message });
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
          const step1 = await Otp.findOne({ email });
          if(step1) 
            return res
            .status(200)
            .json({ message: "Otp already sent to ur mail", statusCode: 201 });
          const otp = Math.floor(1000 + Math.random() * 9000);
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
        }
        else{
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
      return res.status(200).json({ message: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      console.log("userrr");
      // const user = await User.findById(req.user._id).select("-password");

      // if (!user) return res.status(400).json({ message: "User Not Exist" });

      res.json("user");
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      console.log("ssss");
      console.log(req.cookies.refreshtoken);
      const rf_token = req.cookies.refreshtoken;
      console.log(rf_token);
      if (!rf_token) {
        return res.status(400).json({ message: "Please Login" });
        console.log("hellloooww");
      }
      console.log("rf_token2");
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(400).json({ message: "Please Login" });

        const accesstoken = createAccessToken({ id: user.id });

        console.log("token get");
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  sendOtp: (req, res) => {
    try {

      const email="riteshsahoo123123@gmail.com"
      // const otp = "1234";
      const otp = Math.floor(1000 + Math.random() * 9000);
      // console.log("-----------------------------")
      console.log("email", email, " has otp: ", otp);
      mailManager.verifyEmail({ email: email, otp });
      console.log("otp sent successfully");
      res.send("otp send")
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      // res.clearCookie("refreshtoken", { path: "/user/refresh_token" });

      return res.json({ message: "Loggod Out" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

//CREATE ACCESS TOKEN AND REFRESHTOKEN
const createAccessToken = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
