import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// Example route
app.get('/api/example', (req: Request, res: Response) => {
    res.json({ message: 'This is an example route' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 