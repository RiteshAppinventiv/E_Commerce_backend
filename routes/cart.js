const express  = require('express');
const router = express.Router();
const Cart = require('../models/cartSchema')
const cartCtrl  = require('../controllers/cart')
const auth = require('../middlewares/auth')
const userMiddleware = require('../middlewares/userMiddleware');



router.post('/user/cart/create' ,auth,userMiddleware, cartCtrl.addtocart)
// router.get('/category/get',  categoryCtrl.getCategory);

module.exports = router;
