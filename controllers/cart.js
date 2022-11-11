const Cart = require("../models/cartSchema");
const slugify = require("slugify");

const categoryCtrl = {
  addtocart: (req, res) => {
    Cart.findOne({ user: req.user._id }).exec((error, cart) => {
      if (error) return res.status(400).json({ error });


      // console.log(cart.cartItems ,"cartttt")
      if (cart) {
        const product = req.body.cartItems.product;

        const item = cart.cartItems.find(
          (c) => c.product == product

        );

        let condition, update;
        if(item){
          condition = {
            "user": req.user._id,
            "cartItems.product": product,
            }
        update =
          {
            "$set": {
              "cartItems.$" : {
                ...req.body.cartItems,
                quantity: item.quantity + req.body.cartItems.quantity,
              }
            }
          };
        } else {
          condition =  {user : req.user._id};
          update = {
              "$push": {
                "cartItems": req.body.cartItems,
              }
          }
        }
          Cart.findOneAndUpdate( condition
            , update
          ).exec((error, _cart) => {
            if (error) return res.status(400).json({ error });

            if (_cart) {
              return res.status(201).json({ cart: _cart });
            }
          });
        }
        else {
          const cart = new Cart({
            user: req.user._id,
            cartItems: req.body.cartItems,
          });

          cart.save((error, cart) => {
            if (error) return res.status(400).json({ error });

            if (cart) {
              return res.status(201).json({ cart });
            }
          });
        }
      });
    },
        // if(item.products === req.body.cartItems.product){
        //   console.log("helllo")
        // }

        //console.log(cart);
        //return;
        // let updateQuery = cart.user;



        ///UPDATED CODE::::
        //  let newValue = {
        //      $push: {
        //          cartItems: req.body.cartItems
        //      }
        //  };
        //
        //  Cart.updateOne({'_id':cart._id},  newValue, function (err, result) {
        //         if (err) {
        //             console.log(err,'err');
        //             //reject({ status: 0, data: err });
        //         }
        //         else {
        //
        //           // console.log()
        //           Cart.find({ "cart" : cart}, (err, result) => {
        //                 if (err) {
        //                   console.log(err,'err');
        //
        //                   }
        //                     else {
        //                       console.log(req.body,"body")
        //
        //                       for(let cate of cart.cartItems){
        //                         console.log(cate.products._id);
        //                         if(cate.products._id ){
        //                           let newValue = {
        //                             "$set": {
        //                               "cartItems.$" : {
        //                                 ...req.body.cartItems,
        //                                 quantity: item.quantity + req.body.cartItems.quantity,
        //                               },
        //                             },
        //                           };
        //
        //
        //                           Cart.updateOne({
        //                             "user": req.user._id,
        //                             "cartItems.product": product,
        //                           },  newValue, function (err, result) {
        //                               if (err) {
        //
        //                                     //console.log(err,'err');
        //                                       console.log(err,'err');
        //
        //                                         }
        //                                         else {
        //                                             console.log(result,'check result');
        //
        //
        //                                             if (result) {
        //                                               console.log(result)
        //                                              return result;
        //                                               console.log("hello 2")
        //                                             }
        //                                             }
        //                                           });
        //                                     }else {
        //
        //                           console.log("else part")
        //                           Cart.findOneAndUpdate(
        //                             { user: req.user._id },
        //                             {
        //                               "$push": {
        //                                 "cartItems": req.body.cartItems,
        //                               },
        //                             }
        //                           ).exec((error, _cart) => {
        //                             if (error) return res.status(400).json({ error });
        //
        //                             if (_cart) {
        //                               return res.status(201).json({ cart: _cart });
        //                             }
        //                           });
        //                         }
        //
        //
        //                       }
        //                       // console.log(cart.cartItems[0].products);
        //
        //
        //                       }
        //                 })
        //
        //           console.log(result,'check result');
        //             //resolve({ status: 1, data: result });
        //         }
        //     });
        //
        //
        // return res.status(201).json({message : "Cart added successfully"});
        // Cart.find(cart.user, (err, result) => {
        //         if (err) {
        //             console.log(err)
        //         }
        //         else {
        //               // let query = "61935a45dad973908a2dbc4e";
        //               console.log(result,"resultsssss")
        //         }
        //     })



//         console.log(item.products._id,"itemss")
//         console.log(req.body.cartItems.products);
//         if(item.products._id == req.body.cartItems.products ){
//           console.log("trueeeee")
//         }
//
//         if (item ) {
//
//           // Cart.findOne({ user: req.user._id }).exec((error, cart) => {
//           //   if (error) return res.status(400).json({ error });
//           //
//           //   if(cart){
//           //     console.log(cart)
//           //   }
//           // })
//
//
//
//           console.log("if part")
//           Cart.findOneAndUpdate(
//             ,
//           ,
//               },
//             }
//           ).exec((error, _cart) => {
//             if (error) return res.status(400).json({ error });
//
//             if (_cart) {
//               return res.status(201).json({ cart: _cart });
//             }
//           });
//         } else {
//
//           console.log("else part")
//           Cart.findOneAndUpdate(
//             ,
//
//           ).exec((error, _cart) => {
//             if (error) return res.status(400).json({ error });
//
//             if (_cart) {
//               return res.status(201).json({ cart: _cart });
//             }
//           });
//         }
//       } else {
//         const cart = new Cart({
//           user: req.user._id,
//           cartItems: req.body.cartItems,
//         });
//
//         cart.save((error, cart) => {
//           if (error) return res.status(400).json({ error });
//
//           if (cart) {
//             return res.status(201).json({ cart });
//           }
//         });
//       }
//     });
//   },
};

module.exports = categoryCtrl;
