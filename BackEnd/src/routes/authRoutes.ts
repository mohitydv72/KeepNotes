import express from "express"
import { register, login, getProfile, updateProfile } from "../controllers/authController"
import { authenticateToken } from "../middleware/auth"
// import { validateRegister, validateLogin } from "../middleware/validation"

const router = express.Router()

// Public routes
router.post("/register", 
    // validateRegister,
     register)
router.post("/login", 
    // validateLogin,
    login)

// Protected routes
router.get("/profile", authenticateToken, getProfile)
router.put("/profile", authenticateToken, updateProfile)

export default router
