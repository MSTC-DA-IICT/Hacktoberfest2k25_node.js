/**
 * AUTH ROUTES - Authentication and user management routes
 *
 * HACKTOBERFEST TODO:
 * This file defines routes for user authentication.
 *
 * CONTRIBUTOR TASKS:
 * 1. Import express Router
 * 2. Import auth controllers (registerUser, loginUser, getProfile)
 * 3. Import validation middleware (validateRegister, validateLogin, validate)
 * 4. Import auth middleware (protect)
 * 5. Define routes according to API specification:
 *
 * ROUTES TO IMPLEMENT:
 *
 * POST /api/auth/register
 *    - Public route (no auth required)
 *    - Validate request body
 *    - Call registerUser controller
 *
 * POST /api/auth/login
 *    - Public route (no auth required)
 *    - Validate request body
 *    - Call loginUser controller
 *
 * GET /api/auth/profile
 *    - Private route (auth required)
 *    - Use protect middleware
 *    - Call getProfile controller
 *
 * MIDDLEWARE ORDER:
 * Route -> Validation -> Validate -> Controller
 * OR
 * Route -> Auth -> Controller
 *
 * EXAMPLE:
 * router.post('/register', validateRegister, validate, registerUser);
 * router.get('/profile', protect, getProfile);
 */

import express from 'express';

// TODO: Import controllers
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';

// TODO: Import validation middleware
import { validateRegister, validateLogin, validate } from '../middleware/validationMiddleware.js';

// TODO: Import auth middleware
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * TODO: DEFINE AUTHENTICATION ROUTES
 *
 * 1. POST /register
 *    - Middleware: validateRegister, validate
 *    - Controller: registerUser
 *
 * 2. POST /login
 *    - Middleware: validateLogin, validate
 *    - Controller: loginUser
 *
 * 3. GET /profile
 *    - Middleware: protect
 *    - Controller: getProfile
 *
 * EXAMPLES:
 * router.post('/register', [validateRegister, validate], registerUser);
 * router.post('/login', [validateLogin, validate], loginUser);
 * router.get('/profile', protect, getProfile);
 */

// Placeholder route - Remove after implementation
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes not implemented yet',
  });
});

router.get('/profile', protect, getProfile);
router.post('/register', [validateRegister, validate], registerUser);
router.post('/login', [validateLogin, validate], loginUser);

// TODO: Add actual auth routes here

export default router;
