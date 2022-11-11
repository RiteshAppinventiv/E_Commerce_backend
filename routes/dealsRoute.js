const express = require('express');

const router = express.Router();
const dealsController = require('../controllers/dealsController');
const auth = require('../middlewares/auth');
const {validateSignupRequest , isRequestValidated, validateSigninRequest } = require('../validation/auth');

// router.get('/', (req,res) => {
//
//     res.json("Getting data from router folder")
// })

// router.get('/logout', userController.logout)

     // res.json("Sending data from router folder")

// module.exports = router;


// router.post('/addDeals',validateSignupRequest, isRequestVa    lidated, dealsController.addProductDeals)
router.post('/Deals', dealsController.addProductDeals)
router.get('/Deals', dealsController.getAllDeals)
// router.post('/otpVerify', userController.verifyOtp)

// router.post('/login',validateSigninRequest, isRequestValidated, userController.login)

// router.get('/get', auth,userController.getUser)

// router.get('/refresh_token',auth, userCtrl.refreshToken)

// router.get('/logout', userController.logout)

     // res.json("Sending data from router folder")

module.exports = router;
   