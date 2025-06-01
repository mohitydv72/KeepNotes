/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface NoteItem {
  text: string
  completed?: boolean
}

export interface Note {
  _id: string
  title: string
  type: "bullet" | "checklist"
  items: NoteItem[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

export interface CreateNoteData {
  title: string
  type: "bullet" | "checklist"
  items: NoteItem[]
}

export interface UpdateNoteData {
  title?: string
  items?: NoteItem[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface NotesStats {
  totalNotes: number
  bulletNotes: number
  checklistNotes: number
  completedTasks: number
  totalTasks: number
}
