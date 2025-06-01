/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Plus, FileText, CheckSquare, Edit, Trash2, Eye } from "lucide-react"
import toast from "react-hot-toast"

interface Note {
  _id: string
  title: string
  type: "bullet" | "checklist"
  items: Array<{
    text: string
    completed?: boolean
  }>
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "bullet" | "checklist">("all")

useEffect(() => {
  const fetchNotes = async () => {
    try {
      const params = filter !== "all" ? { type: filter } : {}
      const response = await notesAPI.getAllNotes(params)
      setNotes(response.data)
    } catch (error: any) {
      toast.error("Failed to fetch notes")
    } finally {
      setLoading(false)
    }
  }

  fetchNotes()
}, [filter]) 

  const deleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      await notesAPI.deleteNote(id)
      setNotes(notes.filter((note) => note._id !== id))
      toast.success("Note deleted successfully")
    } catch (error: any) {
      toast.error("Failed to delete note")
    }
  }

  const getCompletedCount = (note: Note) => {
    if (note.type !== "checklist") return null
    const completed = note.items.filter((item) => item.completed).length
    return `${completed}/${note.items.length} completed`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
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
        <Button asChild>
          <Link to="/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      {/* Filter buttons */}
<div className="flex space-x-2 mb-6">
  <Button
    size="sm"
    onClick={() => setFilter("all")}
    className={filter === "all" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white border text-blue-600 hover:bg-blue-50"}
  >
    All Notes
  </Button>
  <Button
    size="sm"
    onClick={() => setFilter("bullet")}
    className={filter === "bullet" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white border text-blue-600 hover:bg-blue-50"}
  >
    Bullet Points
  </Button>
  <Button
    size="sm"
    onClick={() => setFilter("checklist")}
    className={filter === "checklist" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white border text-blue-600 hover:bg-blue-50"}
  >
    Checklists
  </Button>
</div>


      {notes.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-6">Create your first note to get started</p>
          <Button asChild>
            <Link to="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={note.type === "bullet" ? "default" : "secondary"}>
                    {note.type === "bullet" ? (
                      <FileText className="w-3 h-3 mr-1" />
                    ) : (
                      <CheckSquare className="w-3 h-3 mr-1" />
                    )}
                    {note.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
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
                  {note.items.length > 3 && (
                    <p className="text-xs text-gray-500">+{note.items.length - 3} more items</p>
                  )}
                </div>

                {note.type === "checklist" && (
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {getCompletedCount(note)}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/notes/${note._id}`}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/notes/${note._id}/edit`}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteNote(note._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}