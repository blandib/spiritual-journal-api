const { body, param } = require('express-validator');
const { ObjectId } = require('mongodb');
const { ValidationError, NotFoundError } = require('../utils/appError');
const { validationResult } = require('express-validator');
exports.validateObjectId = [
  param('id').custom(value => {
    if (!ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  })
];

exports.validateUserData = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

exports.validateEntryData = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('userId')
    .custom(value => {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid user ID format');
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const db = req.app.locals.db;
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(value) 
      });
      if (!user) throw new Error('User not found');
      return true;
    }),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('mood').optional().isIn(['joy', 'peace', 'gratitude', 'struggle', 'neutral'])
    .withMessage('Invalid mood value'),
  body('visibility').optional().isIn(['private', 'public'])
    .withMessage('Invalid visibility value')
    
  
];
//In validateEntryData middleware
exports.validateEntryData = [
  // ... validators ...
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      throw new ValidationError(formattedErrors);
    }
    next();
  }
];

