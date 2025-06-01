/* eslint-disable no-console */
import User from "../models/User"
import Note from "../models/Note"

export const createDemoData = async (): Promise<void> => {
  try {
    // Create demo user
    let demoUser = await User.findOne({ email: "demo@example.com" })

    if (!demoUser) {
      demoUser = new User({
        name: "Demo User",
        email: "demo@example.com",
        password: "demo123",
      })
      await demoUser.save()
      console.log("Demo user created: demo@example.com / demo123")
    }

    // Create demo notes
    const existingNotes = await Note.find({ userId: demoUser._id })

    if (existingNotes.length === 0) {
      const demoNotes = [
        {
          title: "My First Bullet Note",
          type: "bullet",
          items: [
            { text: "This is a bullet point" },
            { text: "Another important point" },
            { text: "Remember to check this later" },
          ],
          userId: demoUser._id,
        },
        {
          title: "Daily Tasks",
          type: "checklist",
          items: [
            { text: "Wake up early", completed: true },
            { text: "Exercise for 30 minutes", completed: true },
            { text: "Read a book", completed: false },
            { text: "Work on project", completed: false },
          ],
          userId: demoUser._id,
        },
        {
          title: "Shopping List",
          type: "checklist",
          items: [
            { text: "Buy groceries", completed: false },
            { text: "Get milk", completed: false },
            { text: "Pick up dry cleaning", completed: true },
          ],
          userId: demoUser._id,
        },
      ]

      await Note.insertMany(demoNotes)
      console.log("Demo notes created")
    }
  } catch (error) {
    console.error("Error creating demo data:", error)
  }
}
