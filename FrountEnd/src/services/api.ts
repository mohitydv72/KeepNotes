import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

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

// Auth API
export const authAPI = {
  login: (email: string, password: string) => api.post("auth/login", { email, password }),
  register: (name: string, email: string, password: string) => api.post("auth/signup", { name, email, password }),
}

// Notes API

interface GetNotesParams {
  type?: "bullet" | "checklist";
}
export const notesAPI = {
  getAllNotes: (params?: GetNotesParams) => api.get("/notes", { params }),
  getNoteById: (id: string) => api.get(`/notes/${id}`),
  createNote: (noteData: unknown) => api.post("/notes", noteData),
  updateNote: (id: string, noteData: unknown) => api.put(`/notes/${id}`, noteData),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
}

export default api
