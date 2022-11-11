const express  = require('express');
const router = express.Router();
const Product  = require('../models/productSchema')
const orderController  = require('../controllers/orderController')
const auth = require('../middlewares/auth')
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/order/details',orderController.orderDetails)
// router.get('/category/get',  categoryCtrl.getCategory);

module.exports = router;
