 
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
// import { ProtectedRoute } from "./components/ProtectedRoute"
import { Navigation } from "./components/Navigation"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import CreateNotePage from "./pages/CreateNotePage"
import ViewNotePage from "./pages/ViewNotePage"
import EditNotePage from "./pages/EditNotePage"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 ">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
                <DashboardPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              // <ProtectedRoute>
                <CreateNotePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id"
            element={
              // <ProtectedRoute>
                <ViewNotePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/edit"
            element={
              // <ProtectedRoute>
                <EditNotePage />
              // </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
