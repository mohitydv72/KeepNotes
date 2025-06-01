import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import Note, { type INoteItem } from "../models/Note"

// @desc    Get all notes for authenticated user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, archived } = req.query

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    // Build query
    const query: {
      userId: string
      isArchived?: boolean
      type?: string
    } = {
      userId: req.userId,
      isArchived: archived === "true",
    }

    if (type && ["bullet", "checklist"].includes(type as string)) {
      query.type = type as string
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 }).populate("userId", "name email")

    res.json({
      success: true,
      count: notes.length,
      data: notes,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate("userId", "name email")

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      })
      return
    }

    res.json({
      success: true,
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, type, items } = req.body

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    // Process items based on note type
    const processedItems: INoteItem[] = items.map((item: INoteItem) => ({
      text: item.text,
      completed: type === "checklist" ? item.completed || false : false,
    }))

    const note = new Note({
      title,
      type,
      items: processedItems,
      userId: req.userId,
    })

    await note.save()
    await note.populate("userId", "name email")

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

// for checklist create json 



// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, items } = req.body

    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      })
      return
    }

    // Update fields
    if (title !== undefined) note.title = title
    if (items !== undefined) {
      note.items = items.map((item: INoteItem) => ({
        text: item.text,
        completed: note.type === "checklist" ? item.completed || false : false,
      }))
    }

    await note.save()
    await note.populate("userId", "name email")

    res.json({
      success: true,
      message: "Note updated successfully",
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      })
      return
    }

    res.json({
      success: true,
      message: "Note deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Archive/Unarchive note
// @route   PATCH /api/notes/:id/archive
// @access  Private
export const toggleArchiveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
      })
      return
    }

    note.isArchived = !note.isArchived
    await note.save()

    res.json({
      success: true,
      message: `Note ${note.isArchived ? "archived" : "unarchived"} successfully`,
      data: note,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get notes statistics
// @route   GET /api/notes/stats
// @access  Private
export const getNotesStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      })
      return
    }

    const stats = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          bulletNotes: {
            $sum: { $cond: [{ $eq: ["$type", "bullet"] }, 1, 0] },
          },
          checklistNotes: {
            $sum: { $cond: [{ $eq: ["$type", "checklist"] }, 1, 0] },
          },
          archivedNotes: {
            $sum: { $cond: ["$isArchived", 1, 0] },
          },
        },
      },
    ])

    const result = stats[0] || {
      totalNotes: 0,
      bulletNotes: 0,
      checklistNotes: 0,
      archivedNotes: 0,
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
