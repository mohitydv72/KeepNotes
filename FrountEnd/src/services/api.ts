import axios, { type AxiosResponse, type AxiosError } from "axios"
import type { AuthResponse, ApiResponse, Note, CreateNoteData, UpdateNoteData, NotesStats } from "../types"

const API_BASE_URL = "https://keepnotesbackend-i6de.onrender.com/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", { name, email, password }),

  getProfile: (): Promise<AxiosResponse<ApiResponse>> => api.get("/auth/profile"),
}

// Notes API
export const notesAPI = {
  getAllNotes: (params: { type?: string } = {}): Promise<AxiosResponse<ApiResponse<Note[]>>> =>
    api.get("/notes", { params }),

  getNoteById: (id: string): Promise<AxiosResponse<ApiResponse<Note>>> => api.get(`/notes/${id}`),

  createNote: (noteData: CreateNoteData): Promise<AxiosResponse<ApiResponse<Note>>> => api.post("/notes", noteData),

  updateNote: (id: string, noteData: UpdateNoteData): Promise<AxiosResponse<ApiResponse<Note>>> =>
    api.put(`/notes/${id}`, noteData),

  deleteNote: (id: string): Promise<AxiosResponse<ApiResponse>> => api.delete(`/notes/${id}`),

  getStats: (): Promise<AxiosResponse<ApiResponse<NotesStats>>> => api.get("/notes/stats"),
}

export default api
