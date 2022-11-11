require("dotenv").config();
const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminCtrl = {
  register: async (req, res) => {
    try {
      const { email, username, password } = req.body;
      // console.log(firstName, lastName, email, password)
      const user = await User.findOne({ email });
      console.log("helllow  ");
      if (user) {
        return res.json({ message: "User already registered", success: false });
      }
      if (password.length < 6) {
        return res
         
          .json({ message: "Password is at least 6 characters", success: false });
      }

      //Password encrypt
      // const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password,
        username,
        role: "admin",
      });
      await newUser.save();
      // console.log("tokensssssss");

      //create jwt
      // const accessToken = createAccessToken({ id: newUser._id });
      // console.log(accessToken, "accessToken");
      // const refreshtoken = createRefreshToken({ id: newUser._id });
      // console.log(accessToken, refreshtoken, "tokensss");

      // res.cookie("refreshtoken", refreshtoken, {
      //   httpOnly: true,
      //   path: "/user/refresh_token",
      // });

      res.json({ message: "Registration successfully", newUser, success: true });
    } catch (err) {
      return res.json({ message: err.message, success: false });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password, } = req.body;

      const user = await User.findOne({ email });

      if (!user)
        return res.json({ message: "Invalid credentials", success: false });

      // const isMatch = await bcrypt.compare(password, user.password);
      if (user) {
        if (user.authentication(password)) {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "3d",
            }
          );

          const { _id, firstName, lastName, email, role, fullName } = user;

          res.cookie("token", token, { expiresIn: "3d" });
          res.json({
            message: "Login user successfully",
            token,
            success: true
          });
        } else {
          return res.json({ message: "Invalid credentials", success: false });
        }
      } else {
        return res.json({ message: "Invalid credentials", success: false });
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
      return res.json({ message: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
          try{
            var userId = await User.findById({_id : req.params.id});
          }catch(err){
            return res.json({ message: "UserId is not Valid" });
          }
           
            const { firstName, lastName, email,username,role } = userId;
 
            const userObj = {
            // firstName: req.body.firstName,
            // lastName : req.body.lastName,
            username:req.body.username,
            hash_password:hash
            };
 
            const user = await User.findByIdAndUpdate({ _id: req.params.id }, userObj);
           
            const findUser = await User.findById({_id:req.params.id})
 
 
           
            res.json({ message: "User Update successfully", user:{firstName:findUser.firstName,lastName:findUser.lastName,username:findUser.username,email:findUser.email,role:findUser.role}, success: true  });
         
     
      } catch (err) {
          return res.json({ message: err.message });
      }
    },


  logout: (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout Complete Successfully" });
  },
};

module.exports = adminCtrl;
