const express = require('express');

const router = express.Router();
const User = require('../models/userSchema')
const bcrypt = require('bcrypt');
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/auth');
const {validateSignupRequest , isRequestValidated, validateSigninRequest } = require('../validation/auth');

// router.get('/', (req,res) => {
//
//     res.json("Getting data from router folder")
// })

router.get('/logout', userCtrl.logout)

     // res.json("Sending data from router folder")

// module.exports = router;


router.post('/register',validateSignupRequest, isRequestValidated, userCtrl.register)

router.post('/login',validateSigninRequest, isRequestValidated, userCtrl.login)

router.get('/get', auth,userCtrl.getUser)

// router.get('/refresh_token',auth, userCtrl.refreshToken)

router.get('/logout', userCtrl.logout)

     // res.json("Sending data from router folder")

module.exports = router;
