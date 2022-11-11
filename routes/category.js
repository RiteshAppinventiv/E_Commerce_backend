const express  = require('express');
const router = express.Router();
const Category = require('../models/categorySchema')
const categoryCtrl  = require('../controllers/category')
const auth = require('../middlewares/auth')
const adminMiddleware = require('../middlewares/adminMiddleware');



router.post('/category/create' ,auth,adminMiddleware, categoryCtrl.create)
router.get('/category/get',  categoryCtrl.getCategory);
router.put('/category/update/:id',auth,adminMiddleware, categoryCtrl.update)
router.delete('/category/delete/:id', auth,adminMiddleware, categoryCtrl.delete)

module.exports = router;
