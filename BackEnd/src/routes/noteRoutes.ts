import express from "express"
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  toggleArchiveNote,
  getNotesStats,
} from "../controllers/noteController"
import { authenticateToken } from "../middleware/auth"
import { validateCreateNote, validateUpdateNote, validateNoteId } from "../middleware/validation"

const router = express.Router()

// All routes are protected
router.use(authenticateToken)

// Notes CRUD routes
router.get("/", getNotes)
router.get("/stats", getNotesStats)
router.get("/:id", 
  validateNoteId, 
  getNoteById)
router.post("/", 
  validateCreateNote, 
  createNote)
router.put("/:id", 
  validateUpdateNote, 
  updateNote)
router.delete("/:id", 
  validateNoteId, 
  deleteNote)
router.patch("/:id/archive", 
  validateNoteId, 
  toggleArchiveNote)

  // all routes link for testing 
  // localhost:5000/api/notes

export default router
