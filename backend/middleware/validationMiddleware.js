/**
 * VALIDATION MIDDLEWARE - Request data validation using express-validator
 *
 * HACKTOBERFEST TODO:
 * This file contains validation rules for different routes.
 *
 * CONTRIBUTOR TASKS:
 * 1. Import validation functions from express-validator:
 *    - body, param, query, validationResult
 *
 * 2. Create validation chains for:
 *    - User registration (name, email, password)
 *    - User login (email, password)
 *    - Question creation (questionText, company, topic, role, difficulty)
 *    - Question update
 *    - Query parameters (search, filters, pagination)
 *
 * 3. Create 'validate' middleware to check validation results:
 *    - Get validation errors using validationResult(req)
 *    - If errors exist, return 400 with error messages
 *    - If no errors, call next()
 *
 * 4. Export all validation chains and the validate middleware
 *
 * VALIDATION RULES:
 * - Email: must be valid email format
 * - Password: minimum 6 characters
 * - QuestionText: minimum 10 characters
 * - Difficulty: must be Easy, Medium, or Hard
 * - Company, topic, role: required, non-empty strings
 *
 * USAGE EXAMPLE:
 * router.post('/register', validateRegister, validate, registerUser);
 */

import { body, param, query, validationResult } from 'express-validator';

/**
 * TODO: IMPLEMENT VALIDATE MIDDLEWARE
 *
 * This middleware checks for validation errors and returns them
 *
 * Steps:
 * 1. Get validation result: const errors = validationResult(req)
 * 2. Check if errors exist: !errors.isEmpty()
 * 3. If errors exist:
 *    - Extract error messages
 *    - Return 400 response with errors array
 * 4. If no errors, call next()
 *
 * EXAMPLE:
 * export const validate = (req, res, next) => {
 *   const errors = validationResult(req);
 *   if (!errors.isEmpty()) {
 *     return res.status(400).json({
 *       success: false,
 *       message: 'Validation failed',
 *       errors: errors.array()
 *     });
 *   }
 *   next();
 * };
 */

export const validate = (req, res, next) => {
  // TODO: Implement validation error checking
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};


export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'), 

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'), 

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

/*
  validateCreateQuestion - Validation chain for creating a new question
  Fields:
 */

export const validateCreateQuestion = [
  body('questionText')
    .trim()
    .notEmpty().withMessage('Question text is required')
    .isLength({ min: 10 }).withMessage('Question must be at least 10 characters'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),

  body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required'),

  body('role')
    .trim()
    .notEmpty().withMessage('Role is required'),

  body('difficulty')
    .notEmpty().withMessage('Difficulty is required')
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
];


export const validateUpdateQuestion = [
  body('questionText')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Question must be at least 10 characters'),

  body('company')
    .optional()
    .trim()
    .notEmpty().withMessage('Company cannot be empty if provided'),

  body('topic')
    .optional()
    .trim()
    .notEmpty().withMessage('Topic cannot be empty if provided'),

  body('role')
    .optional()
    .trim()
    .notEmpty().withMessage('Role cannot be empty if provided'),

  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be \'Easy\', \'Medium\', or \'Hard\''),
];
  



export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

export const validateQueryParams = [
  query('sort')
    .optional()
    .isIn(['latest', 'oldest', 'upvotes'])
    .withMessage("Sort must be one of: 'latest', 'oldest', 'upvotes'"),

  query('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage("Difficulty must be one of: 'Easy', 'Medium', 'Hard'"),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max:100})
    .withMessage('Limit must be a positive integer'),
];
