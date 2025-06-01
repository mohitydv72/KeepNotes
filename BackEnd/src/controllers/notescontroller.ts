// server/controllers/notes.ts
import { Request, Response } from 'express';
import Note, { INote, NoteType } from '../models/notesModel';

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    // For bonus feature: const notes = await Note.find({ userId: req.userId });
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note' });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, type, items } = req.body;
    
    // Validate note type
    if (!['bullet', 'checklist'].includes(type)) {
      return res.status(400).json({ message: 'Invalid note type' });
    }
    
    const newNote = new Note({
      title,
      type,
      items: type === 'bullet' 
        ? items.map((content: string) => ({ content }))
        : items.map(({ content, checked }: { content: string, checked: boolean }) => ({ content, checked })),
      // For bonus feature: userId: req.userId
    });
    
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note' });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { title, items } = req.body;
    const note = await Note.findById(req.params.id);
    
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    // Prevent changing note type
    if (req.body.type && req.body.type !== note.type) {
      return res.status(400).json({ message: 'Cannot change note type' });
    }
    
    note.title = title || note.title;
    note.items = items || note.items;
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note' });
  }
};