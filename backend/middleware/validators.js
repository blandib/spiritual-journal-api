const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Helper to check for valid ObjectId
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  };
};

module.exports = {
  validateObjectId: [
    param("id").custom(
      (value) => ObjectId.isValid(value) || "Invalid ID format"
    ),
  ],

  validateUserData: validateRequest([
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
  ]),

  validateEntryData: validateRequest([
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("userId").custom(
      (value) => ObjectId.isValid(value) || "Invalid user ID"
    ),
  ]),

  // Comments Validators
  createCommentValidator: [
    body("entryId")
      .custom(isValidObjectId)
      .withMessage("Valid entryId is required"),
    body("userId")
      .custom(isValidObjectId)
      .withMessage("Valid userId is required"),
    body("text").isString().notEmpty().withMessage("Comment text is required"),
  ],

  updateCommentValidator: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Valid comment id is required"),
    body("text")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Comment text cannot be empty"),
  ],

  // Categories Validators
  createCategoryValidator: [
    body("name").isString().notEmpty().withMessage("Category name is required"),
    body("description").optional().isString(),
  ],

  updateCategoryValidator: [
    param("id")
      .custom(isValidObjectId)
      .withMessage("Valid category id is required"),
    body("name")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("Category name cannot be empty"),
    body("description").optional().isString(),
  ],
};
