const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  category: String,
});

const Note = mongoose.model('Note', noteSchema);

app.post('/api/notes', async (req, res) => {
  try{
  const { title, description, date, category } = req.body;
  const newNote = new Note({
    title,
    description,
    date,
    category,
  });
  await newNote.save();
  res.json({ message: 'Data has been inserted successfully' });
}catch (err) {
  console.error('Error inserting data:', err);
  res.status(500).json({ error: 'Internal Server Error' });
}
});

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, category } = req.body;
    await Note.findByIdAndUpdate(id, {
      title,
      description,
      date,
      category,
    });
    res.json({ message: 'Data has been edited successfully' });
  } catch (err) {
    console.error('Error editing data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.json({ message: 'Data has been deleted successfully' });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
