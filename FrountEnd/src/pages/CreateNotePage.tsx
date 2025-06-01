/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, type FormEvent, type ChangeEvent, type JSX } from "react"
import { useNavigate, Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { Plus, Trash2, FileText, CheckSquare, ArrowLeft } from "lucide-react"
import type { NoteItem } from "../types"
import toast from "react-hot-toast"

export default function CreateNotePage(): JSX.Element {
  const [title, setTitle] = useState<string>("")
  const [type, setType] = useState<"bullet" | "checklist">("bullet")
  const [items, setItems] = useState<NoteItem[]>([{ text: "" }])
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

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

    setLoading(true)

    try {
      await notesAPI.createNote({
        title: title.trim(),
        type,
        items: validItems,
      })
      toast.success("Note created successfully!")
      navigate("/dashboard")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create note")
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setType(e.target.value as "bullet" | "checklist")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Note</h1>
        <p className="text-gray-600 mt-2">Choose between bullet points or checklist format</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
              <div className="space-y-2">
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    id="bullet"
                    name="type"
                    value="bullet"
                    checked={type === "bullet"}
                    onChange={handleTypeChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="bullet" className="ml-3 flex items-center cursor-pointer flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">Bullet Points</div>
                      <div className="text-sm text-gray-500">Simple list with bullet points</div>
                    </div>
                  </label>
                </div>
                <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    id="checklist"
                    name="type"
                    value="checklist"
                    checked={type === "checklist"}
                    onChange={handleTypeChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="checklist" className="ml-3 flex items-center cursor-pointer flex-1">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">Checklist</div>
                      <div className="text-sm text-gray-500">To-do list with checkboxes</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            {type === "bullet" ? <FileText className="mr-2 h-5 w-5" /> : <CheckSquare className="mr-2 h-5 w-5" />}
            {type === "bullet" ? "Bullet Points" : "Checklist Items"}
          </h2>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {type === "checklist" && (
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
                    placeholder={`Enter ${type === "bullet" ? "bullet point" : "task"}...`}
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
              Add {type === "bullet" ? "Bullet Point" : "Task"}
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Note"}
          </button>
          <Link
            to="/dashboard"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
