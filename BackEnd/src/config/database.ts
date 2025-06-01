// create connection to the database using mongoose
import mongoose from "mongoose"

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/notes-app"
const MONGODB_URI = "mongodb+srv://raosahab:krn0UUmamaQ8BEau@raoji.hbjynne.mongodb.net/keepnotes?retryWrites=true&w=majority&appName=raoji"

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}