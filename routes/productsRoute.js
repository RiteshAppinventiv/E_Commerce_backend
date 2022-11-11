const express  = require('express');
const router = express.Router();
const Product  = require('../models/productSchema')
const productController  = require('../controllers/productController')
const auth = require('../middlewares/auth')
const adminMiddleware = require('../middlewares/adminMiddleware');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

const storage = multer.diskStorage({
  destination : function (req,file,cb)  {
    cb(null , path.join(path.dirname(__dirname),'uploads'))
  },
  filename : function (req,file,cb) {
    cb(null ,shortid.generate() + '-' + file.originalname)
  }
})

const upload = multer({storage});
router.post('/product/post' ,auth,productController.createProduct)
router.post('/product/review' ,auth,productController.addReview)
router.get('/product/addToCart' ,auth,productController.addToCart)
router.get('/product/cart' ,auth,productController.cart)
router.get('/product/itemHandelar' ,auth,productController.itemHandelar)
router.delete('/product/removeCart/:productId' ,auth,productController.removeCart)
router.post('/product/recent' ,productController.recentView)
// router.post('/product/post' ,auth,adminMiddleware,upload.array('productPicture'), productController.createProduct)
// router.get('/product/get',productController.get)
router.get('/product/get',productController.get)
router.post('/product/search',productController.search)
// router.get('/category/get',  categoryCtrl.getCategory);

module.exports = router;
