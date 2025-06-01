import type { Request, Response, NextFunction } from "express"
import { body, param, validationResult } from "express-validator"

// Validation middleware to check for errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
    return
  }
  next()
}

// Auth validation rules
export const validateRegister = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
]

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
]

// Note validation rules
export const validateCreateNote = [
  body("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title must be between 1 and 200 characters"),
  body("type").isIn(["bullet", "checklist"]).withMessage("Type must be either 'bullet' or 'checklist'"),
  body("items").isArray({ min: 1 }).withMessage("Items must be an array with at least one item"),
  body("items.*.text")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Item text must be between 1 and 1000 characters"),
  handleValidationErrors,
]

export const validateUpdateNote = [
  param("id").isMongoId().withMessage("Invalid note ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("items").optional().isArray({ min: 1 }).withMessage("Items must be an array with at least one item"),
  body("items.*.text")
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Item text must be between 1 and 1000 characters"),
  handleValidationErrors,
]

export const validateNoteId = [param("id").isMongoId().withMessage("Invalid note ID"), handleValidationErrors]
