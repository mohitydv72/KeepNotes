/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { Plus, Trash2, FileText, CheckSquare, ArrowLeft, Save } from "lucide-react"
import type { Note, NoteItem } from "../types"
import toast from "react-hot-toast"
import type { JSX } from "react/jsx-runtime"

export default function EditNotePage(): JSX.Element {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState<string>("")
  const [items, setItems] = useState<NoteItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
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
      const data = response.data.data
      setNote(data ?? null)
      setTitle(data?.title ?? "")
      setItems(data?.items ?? [])
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

  const addItem = (): void => {
    setItems([...items, { text: "", completed: false }])
  }

  const removeItem = (index: number): void => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, text: string): void => {
    const newItems = [...items]
    newItems[index].text = text
    setItems(newItems)
  }

  const toggleItemCompleted = (index: number): void => {
    const newItems = [...items]
    newItems[index].completed = !newItems[index].completed
    setItems(newItems)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Please enter a title")
      return
    }

    const validItems = items.filter((item) => item.text.trim())
    if (validItems.length === 0) {
      toast.error("Please add at least one item")
      return
    }

    setSaving(true)

    try {
      await notesAPI.updateNote(note!._id, {
        title: title.trim(),
        items: validItems,
      })
      toast.success("Note updated successfully!")
      navigate(`/notes/${note!._id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update note")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          to={`/notes/${note._id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Note
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Note</h1>
        <p className="text-gray-600 mt-2">
          Make changes to your {note.type === "bullet" ? "bullet point" : "checklist"} note
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Note Details</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              {note.type === "bullet" ? (
                <FileText className="h-5 w-5 text-blue-600" />
              ) : (
                <CheckSquare className="h-5 w-5 text-green-600" />
              )}
              <div>
                <div className="font-medium">{note.type === "bullet" ? "Bullet Points" : "Checklist"}</div>
                <div className="text-sm text-gray-500">Note type cannot be changed after creation</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            {note.type === "bullet" ? <FileText className="mr-2 h-5 w-5" /> : <CheckSquare className="mr-2 h-5 w-5" />}
            {note.type === "bullet" ? "Bullet Points" : "Checklist Items"}
          </h2>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {note.type === "checklist" && (
                  <input
                    type="checkbox"
                    checked={item.completed || false}
                    onChange={() => toggleItemCompleted(index)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                )}
                <div className="flex-1">
                  <textarea
                    value={item.text}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateItem(index, e.target.value)}
                    placeholder={`Enter ${note.type === "bullet" ? "bullet point" : "task"}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {note.type === "bullet" ? "Bullet Point" : "Task"}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            to={`/notes/${note._id}`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
