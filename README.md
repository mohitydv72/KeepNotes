# Full Stack Notes App - Complete TypeScript Implementation

A modern full-stack notes application built with MERN and TypeScript 
## 🚀 Tech Stack

### Frontend 
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend 
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📁 Project Structure

```
notes-app/
├── backend/                      # TypeScript Backend
│   ├── src/
│   │   ├── controllers/          # Route controllers (.ts)
│   │   ├── middleware/           # Custom middleware (.ts)
│   │   ├── models/               # Mongoose models (.ts)
│   │   ├── routes/               # API routes (.ts)
│   │   ├── types/                # Type definitions (.ts)
│   │   ├── utils/                # Utility functions (.ts)
│   │   └── server.ts             # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.json
├── frontend/                     # TypeScript Frontend
│   ├── src/
│   │   ├── components/           # React components (.tsx)
│   │   │   └── ui/               # UI components (.tsx)
│   │   ├── contexts/             # React contexts (.tsx)
│   │   ├── pages/                # Page components (.tsx)
│   │   ├── services/             # API services (.ts)
│   │   ├── types/                # Type definitions (.ts)
│   │   ├── lib/                  # Utility functions (.ts)
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts            # Vite config in TypeScript
│   ├── tailwind.config.ts        # Tailwind config in TypeScript
│   └── postcss.config.ts         # PostCSS config in TypeScript
└── README.md
```

## ✨ Features

- **Complete Type Safety**: Every file is TypeScript with strict type checking
- **User Authentication**: Secure JWT-based auth system
- **Two Note Types**: 
  - Bullet Points: Simple list format
  - Checklists: Task management with completion tracking
- **CRUD Operations**: Full create, read, update, delete functionality
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Instant UI feedback
- **Error Handling**: Comprehensive error handling with typed responses

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm 

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd notes-app
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development" > .env

# Start development server
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install

# Start development server
npm run dev
\`\`\`

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔧 Development Commands

### Backend
\`\`\`bash
cd backend
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Start production server
npm run lint       # Run ESLint

\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
\`\`\`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/stats` - Get notes statistics

## 🎯 TypeScript Features

### Strict Type Safety
- All components have proper prop types
- API responses are strongly typed
- Event handlers are properly typed

### Type Definitions
\`\`\`typescript
// User interface
interface User {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

// Note interface
interface Note {
  _id: string
  title: string
  type: "bullet" | "checklist"
  items: NoteItem[]
  userId: string
  createdAt: string
  updatedAt: string
}

// API Response generic
interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}
\`\`\`

### Configuration Files
- `tsconfig.json` - TypeScript compiler configuration
- `vite.config.ts` - Vite configuration in TypeScript
- `tailwind.config.ts` - Tailwind CSS configuration in TypeScript
- `postcss.config.ts` - PostCSS configuration in TypeScript

## 🧪 Demo Account

For testing purposes:
- **Email**: demo@example.com
- **Password**: demo123

## 🚀 Production Deployment

### Backend
1. Build TypeScript: `npm run build`
2. Set environment variables
3. Deployed to Render

### Frontend
1. Build application: `npm run build`
2. npm run dev
3. Deployed to Vercel

\`\`\`bash


## 🎉 Benefits of Full TypeScript Implementation

1. **Compile-time Error Detection**: Catch errors before runtime
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **Self-documenting Code**: Types serve as documentation
4. **Easier Refactoring**: Safe code changes with type checking
5. **Team Collaboration**: Clear interfaces and contracts
6. **Production Reliability**: Fewer runtime errors


### App Screenshots

| Home Page | Notes Dashboard | Sign Up |
|:----------:|:--------------:|:----------------:|
| ![HomePage](./FrountEnd/public/Images/Homepage.jpg) | ![Dashboard](./FrountEnd/public/Images/Dashboard.jpg) | ![SignUp](./FrountEnd/public/Images/signup.jpg) |

| Log In | Create Note | Edit Note | Filter Bullet or Checklist |
|:------:|:-----------:|:---------:|:--------------------------:|
| ![LogIN](./FrountEnd/public/Images/login.jpg) | ![CreateNote](./FrountEnd/public/Images/createNote.jpg) | ![EditNote](./FrountEnd/public/Images/editNote.jpg) | ![Filter](./FrountEnd/public/Images/filter.jpg) |

> _Screenshots are located in `frontend/public/Images/`_

