import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer(); 


const books = [
    {id: "1", title:"Pride and Prejudice", author: "Jane Austen"},
    {id: "2", title:"The Great Gatsby", author: "Scott Fitzgerald"},
    {id: "3", title: "To Kill a Mockingbird", author: "Harper Lee"},
    {id: "4", title: "One Hundred Years of Solitude", author: "Gabriel García Márquez"}
];

const randomId = () => {
  let id;
  do {
    id = Math.floor(Math.random() * 100).toString();
  } while (books.some(book => book.id === id));
  return id;
};

app.get('/api/get', (req, res) => {
    res.json(books);
  });
  

app.post("/api/post", (req, res) => {
    const { title, author } = req.body;
  
    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }
  
    if (books.some(book => book.title === title)) return res.status(400).json({ message: 'Book already exists' });
  
    const newBook = {
      id: randomId(),
      title,
      author
    };
  
    books.push(newBook);
    return res.status(201).json({ message: 'Book added successfully', book: newBook });
  })

app.put("/api/put/:id", (req, res) => {

    const {id} = req.params;
    const { title, author } = req.body;

    if (!id) return res.status(400).json({ message: "id is required" });
    if (!title || !author) return res.status(400).json({ message: "Title or Auhtor name is required" });
  
    const book = books.find(b => b.id === id);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

  
    if (title) book.title = title;
    if (author) book.author = author;
  
    return res.status(200).json({ message: "Book updated successfully", book });
  });

app.delete("/api/delete/:id", (req, res) => {

    const {id} = req.params
  
    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
  
    const index = books.findIndex(b => b.id === id);
  
    if (index === -1) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const deletedBook = books.splice(index, 1)[0];
  
    return res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
  });
    


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
