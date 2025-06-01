import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists with this email",
      })
      return
    }
    

    // Create new user
    const user = new User({ name, email, password }) as typeof User.prototype
    await user.save()

    // Generate token 
    const token = generateToken(user._id.toString())

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email }) as (typeof User.prototype & { _id: any, isActive?: boolean, comparePassword?: (password: string) => Promise<boolean> })
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
      return
    }

    // Check password
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
      return
    }

    // Generate token
    const token = generateToken(user._id.toString())

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    const user = await User.findByIdAndUpdate(req.userId, { name }, { new: true, runValidators: true })

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    })
  } catch (error) {
    next(error)
  }
}
