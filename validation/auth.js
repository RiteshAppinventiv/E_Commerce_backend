const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
  check("name")
    .notEmpty()
    .withMessage("Username is required")
    // .matches(/^[A-Za-z0-9\s]+$/)
    .isAlpha()
    .withMessage("username must be in alphabets and number."),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Valid Email is required"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateSigninRequest = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Valid Email is required"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateUpdateRequest = [
  check('username').notEmpty().withMessage('userName is required').matches(/^[A-Za-z0-9]+$/).withMessage('Username must be alphaNumeric.'),
  // check('lastName').notEmpty().withMessage('LastName is required').matches(/^[A-Za-z\s]+$/).withMessage('LastName must be alphabetic.'),
  check('password').notEmpty().withMessage('password is required').isLength({min : 6}).withMessage('Password must be at least 6 characters long')
]

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.json({ error: errors.array()[0].msg, success: false });
  }
  next();
};


