import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { FileText, CheckSquare, Plus } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Notes App</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize your thoughts with bullet points or manage your tasks with checklists. Simple, clean, and efficient
            note-taking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/dashboard">
                <Plus className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 text-blue-600 hover:bg-blue-50 border-blue-600">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Bullet Notes</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Perfect for quick thoughts, ideas, and unstructured notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Quick and easy bullet points
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Great for brainstorming
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Flexible formatting
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CheckSquare className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Checklist Notes</CardTitle>
              <CardDescription className="text-base text-gray-600">Ideal for to-do lists and task management</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-3 text-green-500" />
                  Track completed tasks
                </li>
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-3 text-green-500" />
                  Visual progress indicators
                </li>
                <li className="flex items-center">
                  <CheckSquare className="w-4 h-4 mr-3 text-green-500" />
                  Stay organized and productive
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500">Start organizing your thoughts today. No setup required.</p>
        </div>
      </div>
    </div>
  )
}