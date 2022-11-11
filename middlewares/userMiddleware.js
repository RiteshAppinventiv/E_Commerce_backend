const userMiddleware = (req,res,next) => {
  console.log(req.user)
  if(req.user.role !== 'user'){
    return res.status(400).json({ message: 'User Access denied' })
  }
  next();
}
module.exports = userMiddleware
