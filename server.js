const express = require('express');
const path = require('path');
const fs = require('fs'); 


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const NOTES_FILE = path.join(__dirname, 'data.json');

function readNotes() {
    try {
        const data = fs.readFileSync(NOTES_FILE, 'utf8');
        
        if (data.trim() === '') {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`data.json not found at ${NOTES_FILE}. Initializing with empty notes.`);
            return [];
        }
        console.error("Error reading notes file:", error);
        return [];
    }
}

function writeNotes(notes) {
    try {
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf8');
    } catch (error) {
        console.error("Error writing notes file:", error);
    }
}


if (!fs.existsSync(NOTES_FILE) || fs.readFileSync(NOTES_FILE, 'utf8').trim() === '') {
    console.log("Initializing or clearing data.json.");
    writeNotes([]);
}



app.get('/api/notes', (req, res) => {
    const notes = readNotes();
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const notes = readNotes();
    const newNote = {
        id: Date.now().toString(),
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date().toISOString()
    };

    if (!newNote.title || !newNote.content) {
        return res.status(400).json({ message: 'Title and content are required for a new note.' });
    }

    notes.push(newNote);
    writeNotes(notes);
    res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const { title, content } = req.body;
    let notes = readNotes();

    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found.' });
    }

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required for updating a note.' });
    }

    notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        content,
        updatedAt: new Date().toISOString()
    };

    writeNotes(notes);
    res.json(notes[noteIndex]);
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let notes = readNotes();

    const initialLength = notes.length;
    notes = notes.filter(note => note.id !== noteId);

    if (notes.length === initialLength) {
        return res.status(404).json({ message: 'Note not found.' });
    }

    writeNotes(notes);
    res.status(204).send();
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});