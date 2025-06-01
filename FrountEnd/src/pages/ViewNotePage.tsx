/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { ArrowLeft, Edit, Trash2, FileText, CheckSquare, Calendar } from "lucide-react"
import type { Note } from "../types"
import toast from "react-hot-toast"
import type { JSX } from "react/jsx-runtime"

export default function ViewNotePage(): JSX.Element {
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchNote(id)
    }
  }, [id])

  const fetchNote = async (noteId: string): Promise<void> => {
    try {
      const response = await notesAPI.getNoteById(noteId)
      setNote(response.data.data ?? null)
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Note not found")
        navigate("/dashboard")
      } else {
        toast.error("Failed to fetch note")
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteNote = async (): Promise<void> => {
    if (!note || !confirm("Are you sure you want to delete this note?")) return

    try {
      await notesAPI.deleteNote(note._id)
      toast.success("Note deleted successfully")
      navigate("/dashboard")
    } catch (error) {
      toast.error("Failed to delete note")
    }
  }

  const toggleItemCompleted = async (itemIndex: number): Promise<void> => {
    if (!note || note.type !== "checklist") return

    const updatedItems = [...note.items]
    updatedItems[itemIndex].completed = !updatedItems[itemIndex].completed

    try {
      await notesAPI.updateNote(note._id, {
        items: updatedItems,
      })
      setNote({ ...note, items: updatedItems })
    } catch (error) {
      toast.error("Failed to update item")
    }
  }

  const getCompletedCount = (): string | null => {
    if (!note || note.type !== "checklist") return null
    const completed = note.items.filter((item) => item.completed).length
    return `${completed}/${note.items.length} completed`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h2>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{note.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </div>
              {note.updatedAt !== note.createdAt && (
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                note.type === "bullet" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              }`}
            >
              {note.type === "bullet" ? (
                <FileText className="w-4 h-4 mr-1" />
              ) : (
                <CheckSquare className="w-4 h-4 mr-1" />
              )}
              {note.type}
            </span>
            {note.type === "checklist" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {getCompletedCount()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          {note.type === "bullet" ? <FileText className="mr-2 h-5 w-5" /> : <CheckSquare className="mr-2 h-5 w-5" />}
          {note.type === "bullet" ? "Bullet Points" : "Checklist Items"}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {note.items.length} {note.items.length === 1 ? "item" : "items"}
        </p>
        <div className="space-y-4">
          {note.items.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
              {note.type === "bullet" ? (
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              ) : (
                <input
                  type="checkbox"
                  checked={item.completed || false}
                  onChange={() => toggleItemCompleted(index)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              )}
              <div className="flex-1">
                <p
                  className={`text-gray-900 whitespace-pre-wrap ${
                    note.type === "checklist" && item.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          to={`/notes/${note._id}/edit`}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Note
        </Link>
        <button
          onClick={deleteNote}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Note
        </button>
      </div>
    </div>
  )
}
