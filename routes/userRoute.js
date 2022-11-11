const express = require('express');

const router = express.Router();
const User = require('../models/userSchema')
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const {validateSignupRequest , isRequestValidated, validateSigninRequest } = require('../validation/auth');

// router.get('/', (req,res) => {
//
//     res.json("Getting data from router folder")
// })

router.get('/logout', userController.logout)

     // res.json("Sending data from router folder")

// module.exports = router;


router.post('/signUp',validateSignupRequest, isRequestValidated, userController.signUp)
router.post('/otpVerify', userController.verifyOtp)

router.post('/login',validateSigninRequest, isRequestValidated, userController.login)

router.get('/get', auth,userController.getUser)
router.get('/sendOtp',userController.sendOtp)

// router.get('/refresh_token',auth, userCtrl.refreshToken)

router.get('/logout', userController.logout)

     // res.json("Sending data from router folder")

module.exports = router;
