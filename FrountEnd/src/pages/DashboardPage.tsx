/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { Plus, FileText, CheckSquare, Edit, Trash2, Eye } from "lucide-react"
import type { Note } from "../types"
import toast from "react-hot-toast"
import type { JSX } from "react/jsx-runtime"

export default function DashboardPage(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchNotes()
  }, [filter])

  const fetchNotes = async (): Promise<void> => {
    try {
      const params = filter !== "all" ? { type: filter } : {}
      const response = await notesAPI.getAllNotes(params)
      setNotes(response.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch notes")
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (id: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      await notesAPI.deleteNote(id)
      setNotes(notes.filter((note) => note._id !== id))
      toast.success("Note deleted successfully")
    } catch (error) {
      toast.error("Failed to delete note")
    }
  }

  const getCompletedCount = (note: Note): string | null => {
    if (note.type !== "checklist") return null
    const completed = note.items.filter((item) => item.completed).length
    return `${completed}/${note.items.length} completed`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all your notes in one place</p>
        </div>
        <Link
          to="/notes/new"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Link>
      </div>

      {/* Filter buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Notes
        </button>
        <button
          onClick={() => setFilter("bullet")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "bullet" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Bullet Points
        </button>
        <button
          onClick={() => setFilter("checklist")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === "checklist" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Checklists
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-6">Create your first note to get started</p>
          <Link
            to="/notes/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Note
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    note.type === "bullet" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {note.type === "bullet" ? (
                    <FileText className="w-3 h-3 mr-1" />
                  ) : (
                    <CheckSquare className="w-3 h-3 mr-1" />
                  )}
                  {note.type}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {note.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    {note.type === "bullet" ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                        <span className="line-clamp-1">{item.text}</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare
                          className={`w-3 h-3 mr-2 flex-shrink-0 ${
                            item.completed ? "text-green-500" : "text-gray-400"
                          }`}
                        />
                        <span className={`line-clamp-1 ${item.completed ? "line-through text-gray-400" : ""}`}>
                          {item.text}
                        </span>
                      </>
                    )}
                  </div>
                ))}
                {note.items.length > 3 && <p className="text-xs text-gray-500">+{note.items.length - 3} more items</p>}
              </div>

              {note.type === "checklist" && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {getCompletedCount(note)}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Link
                  to={`/notes/${note._id}`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Link>
                <Link
                  to={`/notes/${note._id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Link>
                <button
                  onClick={() => deleteNote(note._id)}
                  className="inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
