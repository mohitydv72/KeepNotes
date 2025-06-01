/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { notesAPI } from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Checkbox } from "../components/ui/checkbox"
import { Plus, Trash2, FileText, CheckSquare, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

interface NoteItem {
  text: string
  completed?: boolean
}

export default function CreateNotePage() {
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"bullet" | "checklist">("bullet")
  const [items, setItems] = useState<NoteItem[]>([{ text: "" }])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 ">Create New Note</h1>
        <p className="text-gray-600  mt-2">Choose between bullet points or checklist format</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
            <CardDescription>Enter the title and select the format for your note</CardDescription>
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

            <div>
              <Label>Note Type</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "bullet" | "checklist")}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 ">
                  <RadioGroupItem value="bullet" id="bullet" />
                  <Label htmlFor="bullet" className="flex items-center cursor-pointer flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">Bullet Points</div>
                      <div className="text-sm text-gray-500">Simple list with bullet points</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 ">
                  <RadioGroupItem value="checklist" id="checklist" />
                  <Label htmlFor="checklist" className="flex items-center cursor-pointer flex-1">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">Checklist</div>
                      <div className="text-sm text-gray-500">To-do list with checkboxes</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {type === "bullet" ? <FileText className="mr-2 h-5 w-5" /> : <CheckSquare className="mr-2 h-5 w-5" />}
              {type === "bullet" ? "Bullet Points" : "Checklist Items"}
            </CardTitle>
            <CardDescription>Add items to your {type === "bullet" ? "bullet point list" : "checklist"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {type === "checklist" && (
                  <Checkbox checked={item.completed || false} onCheckedChange={() => toggleItemCompleted(index)} />
                )}
                <div className="flex-1">
                  <Textarea
                    value={item.text}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder={`Enter ${type === "bullet" ? "bullet point" : "task"}...`}
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
              Add {type === "bullet" ? "Bullet Point" : "Task"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Note"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link to="/dashboard">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
