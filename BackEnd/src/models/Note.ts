import mongoose, { type Document, Schema } from "mongoose"
import type { IUser } from "./User"

export interface INoteItem {
  text: string
  completed?: boolean
}

export interface INote extends Document {
  title: string
  type: "bullet" | "checklist"
  items: INoteItem[]
  userId: IUser["_id"]
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

const noteItemSchema = new Schema<INoteItem>({
  text: {
    type: String,
    required: [true, "Item text is required"],
    trim: true,
    maxlength: [1000, "Item text cannot exceed 1000 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title must be at least 1 character"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    type: {
      type: String,
      enum: {
        values: ["bullet", "checklist"],
        message: "Type must be either 'bullet' or 'checklist'",
      },
      required: [true, "Note type is required"],
    },
    items: {
      type: [noteItemSchema],
      validate: {
        validator: (items: INoteItem[]) => items && items.length > 0,
        message: "Note must have at least one item",
      },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
noteSchema.index({ userId: 1, createdAt: -1 })
noteSchema.index({ userId: 1, type: 1 })

export default mongoose.model<INote>("Note", noteSchema)
