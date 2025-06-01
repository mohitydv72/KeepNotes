/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/checkbox"
import { Plus, Trash2, FileText, CheckSquare, ArrowLeft, Save } from "lucide-react"
import toast from "react-hot-toast"

interface NoteItem {
  text: string
  completed?: boolean
}

interface Note {
  _id: string
  title: string
  type: "bullet" | "checklist"
  items: NoteItem[]
  createdAt: string
  updatedAt: string
}

export default function EditNotePage() {
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<NoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchNote(id)
    }
  }, [id])

  const fetchNote = async (noteId: string) => {
    try {
      const response = await notesAPI.getNoteById(noteId)
      const data = response.data
      setNote(data)
      setTitle(data.title)
      setItems(data.items)
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

  const addItem = () => {
    setItems([...items, { text: "", completed: false }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, text: string) => {
    const newItems = [...items]
    newItems[index].text = text
    setItems(newItems)
  }

  const toggleItemCompleted = (index: number) => {
    const newItems = [...items]
    newItems[index].completed = !newItems[index].completed
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
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
        type: note!.type,
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
          <h2 className="text-2xl font-bold text-gray-900  mb-4">Note not found</h2>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to={`/notes/${note._id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Note
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ">Edit Note</h1>
        <p className="text-gray-600  mt-2">
          Make changes to your {note.type === "bullet" ? "bullet point" : "checklist"} note
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
            <CardDescription>Update the title and content of your note</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50  rounded-lg">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {note.type === "bullet" ? (
                <FileText className="mr-2 h-5 w-5" />
              ) : (
                <CheckSquare className="mr-2 h-5 w-5" />
              )}
              {note.type === "bullet" ? "Bullet Points" : "Checklist Items"}
            </CardTitle>
            <CardDescription>
              Edit items in your {note.type === "bullet" ? "bullet point list" : "checklist"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {note.type === "checklist" && (
                  <Checkbox checked={item.completed || false} onCheckedChange={() => toggleItemCompleted(index)} />
                )}
                <div className="flex-1">
                  <Textarea
                    value={item.text}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder={`Enter ${note.type === "bullet" ? "bullet point" : "task"}...`}
                    className="min-h-[60px] resize-none"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addItem} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add {note.type === "bullet" ? "Bullet Point" : "Task"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link to={`/notes/${note._id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
