const jwt = require("jsonwebtoken");




const auth =async (req,res,next) => {
  try{
    const token = req.header("Authorization");
    // console.log(token,"mid token")
    // console.log("---===========----",process.env.TOKEN_SECRET)
    if(!token) return res.json({message : "Invalid authentication"})

    jwt.verify(token,process.env.TOKEN_SECRET,(err,user) => {
      if(err) return res.json({message : "Invalid authentication"})

      req.user = user
      next();
    })
  }catch(err){
    return res.json({message:err.message})
  }
}


// const userMiddleware = (req,res,next) => {
//
// }
//


module.exports = auth
