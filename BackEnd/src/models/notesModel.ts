// server/models/Note.ts
import mongoose, { Document, Schema } from 'mongoose';

export type NoteType = 'bullet' | 'checklist';

export interface INoteItem {
  content: string;
  checked?: boolean; // Only for checklist type
}

export interface INote extends Document {
  title: string;
  type: NoteType;
  items: INoteItem[];
  userId?: mongoose.Types.ObjectId; // For bonus feature
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  type: { type: String, enum: ['bullet', 'checklist'], required: true },
  items: [{
    content: { type: String, required: true },
    checked: { type: Boolean, default: false }
  }],
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // For bonus feature
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);