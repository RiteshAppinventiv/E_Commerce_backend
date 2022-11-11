const Product = require("../models/productSchema");
const Feedback = require("../models/feedbackSchema");
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const productController = {
  createProduct: (req, res) => {
    const {
      title,
      companyName,
      originalPrice,
      discountPercentage,
      description,
      offers,
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
      offers,
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
    try {
      const { title } = req.body;
      let result = title.split(/[.,\-\s=/_]/);
      console.log("ressssss------", result);
      var filtered = result.filter(function (el) {
        if(el != ""){
          return " "+el+" ";
        }
      });
      // console.log("ressssss------", filtered);
      let regex = filtered.join(" |");
      console.log("regexxxxxx------ ",regex);
      // console.log("--------regex---------------", regex);
      let pipeline = [];

      pipeline.push({
        $match: {
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
        },
      });

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
          isHighlightShow: 1,
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

      let result1 = await Product.aggregate(pipeline);

      res.status(201).json({
        message: "get data successfully",
        data: result1,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  addReview: async (req, res) => {
    try {
      const { ratting, title, reviews, productId } = req.body;

      const step1 = await Product.findOne({ _id: productId });
      if (!step1)
        return res.status(201).json({
          message: "Product not found",
          data: "no data found",
          statusCode: 401,
        });

      const newReview = new Feedback({
        ratting,
        title,
        reviews,
        productId: ObjectId(productId),
        reviewedBy: ObjectId(req.user._id),
      });
      await newReview.save();

      return res.status(200).json({
        message: "review added successfully",
        data: newReview,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  recentView: async (req, res) => {
    try {
      const { ids } = req.body;
      let objectIdArray = ids.map((s) => mongoose.Types.ObjectId(s));
      let pipeline = [];

      pipeline.push({
        $match: { _id: { $in: objectIdArray } },
      });

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
          // description: 1,
          // offers: 1,
          productPictures: 1,
          // Highlights: 1,
          // Reviews: "$finalproducts",
          // totalReview: { $size: "$finalproducts.reviews" },
          totalRatting: { $size: "$finalproducts.ratting" },
          avgRatting: {
            $sum: {
              $avg: "$finalproducts.ratting",
            },
          },
        },
      });

      const step1 = await Product.aggregate(pipeline);

      if (!step1)
        return res.status(201).json({
          message: "no recent products viewed",
          data: "no data found",
          statusCode: 401,
        });

      return res.status(201).json({
        message: "recent product get successfully",
        data: step1,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { productId } = req.query;
      console.log("product id: " + productId);
      const step1 = await Product.findById({ _id: productId });
      if (!step1)
        return res.status(201).json({
          message: "no product found",
          data: "no data found",
          statusCode: 401,
        });

      const step2 = await User.findOne({ _id: req.user._id });
      if (!step2)
        return res.status(201).json({
          message: "User not found",
          data: "no data found",
          statusCode: 401,
        });

      const step3 = await User.updateOne(
        { _id: req.user._id, "cartItems.productId": { $ne: productId } },
        { $addToSet: { cartItems: { productId: ObjectId(productId) } } }
      );

      if (!step3.modifiedCount) {
        return res.status(200).json({
          message: "item already in cart",
          step3,
          statusCode: 403,
        });
      }

      return res.status(200).json({
        message: "item added to cart successfully",
        step3,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  cart: async (req, res) => {
    try {
      let pipeline = [];

      pipeline.push({
        $match: { _id: ObjectId(req.user._id) },
      });

      pipeline.push({
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          pipeline: [
            {
              $addFields: {
                // offValue: {
                //   $multiply: [
                //     { $divide: ["$discountPercentage", 100] },
                //     "$originalPrice",
                //   ],
                // },
                savePrice: {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$discountPercentage", 100] },
                        "$originalPrice",
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "cartproducts",
        },
      });

      pipeline.push({
        $project: {
          name: 1,
          cartProducts: {
            $map: {
              input: "$cartItems", //array1
              as: "f",
              in: {
                $mergeObjects: [
                  "$$f",
                  {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$cartproducts", // array2
                          cond: { $eq: ["$$this._id", "$$f.productId"] },
                        },
                      },
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
      });

      pipeline.push({
        $project: {
          _id: 1,
          name: 1,
          "cartProducts.productId": 1,
          "cartProducts.title": 1,
          "cartProducts.quantity": 1,
          "cartProducts.companyName": 1,
          "cartProducts.Highlights": 1,
          "cartProducts.originalPrice": 1,
          "cartProducts.discountPercentage": 1,
          "cartProducts.offers": 1,
          "cartProducts.productPictures": 1,
          // "cartProducts.offValue": 1,
          "cartProducts.savePrice": 1,
          originalPriceArray: "$cartProducts.originalPrice",
          // quantityArray: "$cartProducts.quantity",
          // totalItems: { $size: "$cartProducts" },
          // totalOriginalPrice: {
          //   $sum: "$cartProducts.originalPrice",
          // },
          // totalSavedPrice: {
          //   $sum: "$cartProducts.savePrice",
          // },
        },
      });

      pipeline.push({
        $addFields: {
          totalOriginalPrice: {
            $sum: {
              $map: {
                input: "$cartProducts",
                as: "items",
                in: {
                  $multiply: [
                    { $ifNull: ["$$items.quantity", 0] },
                    { $ifNull: ["$$items.originalPrice", 0] },
                  ],
                },
              },
            },
          },
          totalSavedPrice: {
            $sum: {
              $map: {
                input: "$cartProducts",
                as: "items",
                in: {
                  $multiply: [
                    { $ifNull: ["$$items.quantity", 0] },
                    { $ifNull: ["$$items.savePrice", 0] },
                  ],
                },
              },
            },
          },
        },
      });

      // pipeline.push({
      //   $project: {
      //     _id: 1,
      //     name: 1,
      //     "cartProducts.productId": 1,
      //     "cartProducts.title": 1,
      //     "cartProducts.quantity": 1,
      //     "cartProducts.companyName": 1,
      //     "cartProducts.Highlights": 1,
      //     "cartProducts.originalPrice": 1,
      //     "cartProducts.discountPercentage": 1,
      //     "cartProducts.offers": 1,
      //     "cartProducts.productPictures": 1,
      //     "cartProducts.offValue": 1,
      //     "cartProducts.savePrice": 1,
      //     // answer : {$multiply: ["$cartProducts.quantity", 1]}  ,
      //     totalItems: { $size: "$cartProducts" },
      //     totalOriginalPrice: {
      //       $sum: "$cartProducts.originalPrice",
      //     },
      //     totalSavedPrice: {
      //       $sum: "$cartProducts.savePrice",
      //     },
      //     "total":{
      //       "$sum":{
      //         "$map":{
      //           "input":{"$range":[0,{"$size":"$cartProducts"}]},
      //           "as":"ix",
      //           "in":{
      //             "$let":{
      //               "vars":{
      //                 "pre":{"$arrayElemAt":["$colheita.precario","$$ix"]},
      //                 "cal":{"$arrayElemAt":["$colheita.Lote.calibragem","$$ix"]}
      //               },
      //               "in":{"$multiply":["$$ix.quantity",1]}
      //             }
      //           }
      //         }
      //       }
      //     }
      //   },
      // });

      let result = await User.aggregate(pipeline);

      return res.status(200).json({
        message: "cart item get successfully",
        data: result,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  itemHandelar: async (req, res) => {
    try {
      let { productId, status } = req.query;

      let updateValue = 0;

      if (status === "inc") updateValue = 1;
      else if (status === "desc") updateValue = -1;

      const result = await User.updateOne(
        {
          _id: req.user._id,
          "cartItems.productId": { $eq: productId },
        },
        { $inc: { "cartItems.$.quantity": updateValue } },
        { new: true }
      );

      if (!result.matchedCount)
        return res.status(200).json({
          message: "cart item not found",
          data: result,
          statusCode: 404,
        });

      return res.status(200).json({
        message: "cart item updated successfully",
        data: result,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },

  removeCart: async (req, res) => {
    try {
      let { productId } = req.params;

      const result = await User.updateOne(
        {
          _id: req.user._id,
        },
        { $pull: { cartItems: { productId } } },
        // false,true
      );

      return res.status(200).json({
        message: "cart item remove successfully",
        data: result,
        statusCode: 200,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message, statusCode: 400 });
    }
  },
};

module.exports = productController;
