/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from "express"

interface CustomError extends Error {
  statusCode?: number
  code?: number
  keyValue?: Record<string, any>
  errors?: Record<string, { path: string; message: string }>
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", err)

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }))
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    })
    return
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0]
    res.status(409).json({
      success: false,
      message: `${field} already exists`,
    })
    return
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
    })
    return
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    })
    return
  }

  if (err.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    })
    return
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

export default errorHandler
