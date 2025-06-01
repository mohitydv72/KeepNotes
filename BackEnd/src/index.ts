import express, { Request, Response } from "express";
import { connectDB } from "./config/database";
import userModel from "./models/userModel";
import notesModel from "./models/notesModel";
// import noteRoutes from "./routes/noteRoutes";
const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());

// app.use('/api/notes', noteRoutes);

//create user for testing
app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const user = new userModel({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// notes model testing

// app.post('/api/notes', async (req: Request, res: Response) => {
//     try {
//         const { title, type, items, userId } = req.body;
//         const note = new notesModel({ title, type, items, userId });
//         await note.save();
//         res.status(201).json({ message: 'Note created successfully', note });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating note', error });
//     }
// });

// app.get('/api/notes', async (req: Request, res: Response) => {
//     try {
//         const notes = await notesModel.find();
//         res.status(200).json(notes);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching notes', error });
//     }
// });

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// Example route
app.get('/api/example', (req: Request, res: Response) => {
    res.json({ message: 'This is an example route' });
});

app.listen(PORT, () => {
    connectDB().then(() => {
        console.log("Database connected successfully");
    }).catch((error) => {
        console.error("Database connection failed:", error);
    });
  console.log(`Server running on port ${PORT}`);
}); 