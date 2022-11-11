const adminMiddleware = (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== "admin") {
    return res.status(400).json({ message: "Admin Access denied" });
  }
  next();
};
module.exports = adminMiddleware;
