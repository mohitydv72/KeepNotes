// server/routes/notes.ts
import express, { Request, Response } from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notescontroller';
import { authMiddleware } from '../middleware/authMiddleware'; 

const noteRouter = express.Router();

// For bonus feature: noteRouter.use(authMiddleware);
noteRouter.get('/', authMiddleware, getAllNotes);
noteRouter.get('/:id', getNoteById);
noteRouter.post('/', createNote);
noteRouter.put('/:id', updateNote);
noteRouter.delete('/:id', deleteNote);

export default noteRouter;