const Product = require("../models/productSchema");
const mongoose = require("mongoose");
const { aggregate } = require("../models/productSchema");
const ObjectId = mongoose.Types.ObjectId;
const orderController = {
  createProduct: (req, res) => {
    const {
      title,
      companyName,
      originalPrice,
      discountPercentage,
      description,
      offer,
      productPictures,
      Highlights,
      productType,
      isHighlightShow,
    } = req.body;

    console.log("------===========--", req.user);

    const product = new Product({
      title,
      companyName,
      originalPrice,
      discountPercentage,
      description,
      offer,
      productPictures,
      Highlights,
      productType,
      isHighlightShow,
      createdBy: req.user._id,
    });

    product.save((error, product) => {
      if (error) return res.status(400).json({ error });

      if (product) {
        res.status(201).json({ product });
      }
    });
  },

  get: (req, res) => {
    Product.find({}).exec((error, categories) => {
      if (error) return res.status(400).json({ error });

      if (categories) {
        res.status(200).json({ categories });
      }
    });
  },

  search: async (req, res) => {
    const { title } = req.body;
    // db.stores.find( { $text: { $search: "java shop -coffee" } } )
    // const result = Product.find({ $text: { $search: title } });
    // const str = "aads.b c=d/e_f";

    let result = title.split(/[.,\-\s=/_]/);
    console.log("ressssss------", result);
    var filtered = result.filter(function (el) {
      return el != "";
    });
    console.log("ressssss------", filtered);
    let regex = filtered.join("|");
    // console.log("--------regex---------------", regex);

    let result1 = await Product.find({
      $or: [
        {
          companyName: {
            $regex: regex,
            $options: "i",
          },
        },
        {
          productType: {
            $regex: regex,
            $options: "i",
          },
        },
        {
          title: {
            $regex: regex,
            $options: "i",
          },
        },
      ],
    });

    res.status(201).json({
      message: "get data successfully",
      data: result1,
      statusCode: 200,
    });
  },

  orderDetails: async (req, res) => {
    try {
      let pipeline = [];

      let { productId } = req.query;

      pipeline.push({ $match: { _id: ObjectId(productId) } });

      pipeline.push({
        $lookup: {
          from: "feedbacks",
          localField: "_id",
          foreignField: "productId",
          as: "finalproducts",
        },
      });

      pipeline.push({
        $project: {
          _id: 1,
          title: 1,
          companyName: 1,
          originalPrice: 1,
          discountPercentage: 1,
          description: 1,
          offers: 1,
          productPictures: 1,
          Highlights: 1,
          Reviews: "$finalproducts",
          totalReview: { $size: "$finalproducts.reviews" },
          totalRatting: { $size: "$finalproducts.ratting" },
          avgRatting: {
            $sum: {
              $avg: "$finalproducts.ratting",
            },
          },
        },
      });

      const step1 = await Product.aggregate(pipeline);

      res.status(200).json({
        message: "All Deals Get successfully",
        data: step1,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },
};

module.exports = orderController;
