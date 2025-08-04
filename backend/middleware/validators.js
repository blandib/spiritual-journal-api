const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    next();
  };
};

module.exports = {
  validateObjectId: [
    param('id').custom(value => ObjectId.isValid(value) || 'Invalid ID format')
  ],
  
  validateUserData: validateRequest([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
  ]),
  
  validateEntryData: validateRequest([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('userId')
      .custom(value => ObjectId.isValid(value) || 'Invalid user ID')
  ])
};

