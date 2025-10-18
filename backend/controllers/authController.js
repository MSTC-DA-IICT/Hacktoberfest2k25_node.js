/**
 * AUTH CONTROLLER - Handles user authentication logic
 *
 * HACKTOBERFEST TODO:
 * This controller manages user registration, login, and profile retrieval.
 *
 * CONTRIBUTOR TASKS:
 * Implement three controller functions:
 *
 * 1. registerUser (POST /api/auth/register):
 *    - Extract name, email, password from req.body
 *    - Check if user already exists (by email)
 *    - If exists, return 400 error
 *    - Create new user using User.create()
 *    - Generate JWT token using user.generateAuthToken()
 *    - Return 201 response with user data and token
 *
 * 2. loginUser (POST /api/auth/login):
 *    - Extract email, password from req.body
 *    - Find user by email
 *    - If user not found, return 401 error
 *    - Compare password using user.comparePassword()
 *    - If password incorrect, return 401 error
 *    - Generate JWT token
 *    - Return 200 response with user data and token
 *
 * 3. getProfile (GET /api/auth/profile):
 *    - User is already attached to req.user by protect middleware
 *    - Return user data (excluding password)
 *    - Return 200 response with user data
 *
 * ERROR HANDLING:
 * - Wrap all async operations in try-catch
 * - Pass errors to next(error) for centralized error handling
 * - Use appropriate status codes (400, 401, 404, 500)
 *
 * RESPONSE FORMAT:
 * Success: { success: true, message: '...', data: {...}, token: '...' }
 * Error: { success: false, message: '...' }
 */

import User from '../models/User.js';

/**
 * TODO: IMPLEMENT REGISTER USER CONTROLLER
 *
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 *
 * Steps:
 * 1. Extract name, email, password from req.body
 * 2. Check if user already exists:
 *    - Use User.findOne({ email })
 *    - If exists, return 400 with message "User already exists"
 * 3. Create new user:
 *    - Use User.create({ name, email, password })
 *    - Password will be hashed automatically by pre-save middleware
 * 4. Generate JWT token:
 *    - Call user.generateAuthToken()
 * 5. Return response:
 *    - Status 201 (Created)
 *    - Include: success, message, user data (exclude password), token
 * 6. Handle errors:
 *    - Wrap in try-catch
 *    - Pass error to next(error)
 *
 * EXAMPLE RESPONSE:
 * {
 *   success: true,
 *   message: 'User registered successfully',
 *   user: { id, name, email, role },
 *   token: 'jwt_token_here'
 * }
 */

export const registerUser = async (req, res, next) => {
  try {
    // TODO: Implement user registration logic

    // 1. Extract data from request body
    const { name, email, password } = req.body;
    console.log(name, email, password)

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser){
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }

    // 3. Create new user
    const user = await User.create({ name, email, password });
    const {_id, role} = user;
    // 4. Generate token
    const token = user.generateAuthToken();

    // 5. Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: { id: _id, name, email, role },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * TODO: IMPLEMENT LOGIN USER CONTROLLER
 *
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 *
 * Steps:
 * 1. Extract email, password from req.body
 * 2. Find user by email:
 *    - Use User.findOne({ email }).select('+password')
 *    - Note: Use .select('+password') because password is excluded by default
 * 3. Check if user exists:
 *    - If not found, return 401 with message "Invalid credentials"
 * 4. Verify password:
 *    - Call user.comparePassword(password)
 *    - If incorrect, return 401 with message "Invalid credentials"
 * 5. Generate token:
 *    - Call user.generateAuthToken()
 * 6. Return response:
 *    - Status 200
 *    - Include: success, message, user data (exclude password), token
 * 7. Handle errors:
 *    - Wrap in try-catch
 *    - Pass error to next(error)
 *
 * SECURITY NOTE:
 * Always use the same error message "Invalid credentials" for both
 * "user not found" and "wrong password" to prevent email enumeration attacks.
 *
 * EXAMPLE RESPONSE:
 * {
 *   success: true,
 *   message: 'Login successful',
 *   user: { id, name, email, role },
 *   token: 'jwt_token_here'
 * }
 */

export const loginUser = async (req, res, next) => {
  try {
    // TODO: Implement user login logic

    // 1. Extract credentials from request body
    const { email, password } = req.body;

    // 2. Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password');

    // 3. Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Verify password (not mentioning specifically that its password thats wrong because someone might misuse this logs)
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { _id, name, role } = user;


    // 5. Generate token
    const token = user.generateAuthToken();

    // 6. Send response (exclude password from response)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id:_id, name, email, role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * TODO: IMPLEMENT GET PROFILE CONTROLLER
 *
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires authentication)
 *
 * Steps:
 * 1. User is already available in req.user (set by protect middleware)
 * 2. Optionally fetch fresh user data from database:
 *    - Use User.findById(req.user.id).select('-password')
 * 3. Return response:
 *    - Status 200
 *    - Include: success, message, user data
 * 4. Handle errors:
 *    - If user not found, return 404
 *    - Pass errors to next(error)
 *
 * NOTE: This route is protected by the 'protect' middleware,
 * so req.user will always be available if the request reaches here.
 *
 * EXAMPLE RESPONSE:
 * {
 *   success: true,
 *   user: {
 *     id: '...',
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     role: 'user',
 *     createdAt: '...'
 *   }
 * }
 */

export const getProfile = async (req, res, next) => {
  try {
    // TODO: Implement get profile logic
    //altho user will be there, just incase added it
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User is not validated",
      });
    }


    // Option 1: Use req.user directly (set by protect middleware)
    // return res.status(200).json({ success: true, user: req.user });

    // Option 2: Fetch fresh data from database
    // const user = await User.findById(req.user.id).select('-password');
    const user = await User.findById(req.user.id).select("-password");

    // if (!user) { return 404 error }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // return res.status(200).json({ success: true, user });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
