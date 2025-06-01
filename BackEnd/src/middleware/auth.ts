import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

interface JwtPayload {
  userId: string
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access token required",
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select("-password")
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "User not found or inactive",
      })
      return
    }

    req.user = user
    req.userId = (user._id as { toString(): string }).toString()
    next()
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({
        success: false,
        message: "Invalid token",
      })
      return
    }
    if (error.name === "TokenExpiredError") {
      res.status(403).json({
        success: false,
        message: "Token expired",
      })
      return
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({
      success: false,
      message: "Authentication error",
    })
  }
}
