document.addEventListener("DOMContentLoaded", () => {
    const notesList = document.getElementById("notes-list");
    const noteForm = document.getElementById("note-form");
    const noteIdInput = document.getElementById("note-id"); 
    const noteTitleInput = document.getElementById("note-title");
    const noteContentInput = document.getElementById("note-content");
    const saveNoteBtn = document.getElementById("save-note-btn");
    const cancelEditBtn = document.getElementById("cancel-edit-btn");

    const API_BASE_URL = "/api/notes"; 


    const clearForm = () => {
        noteIdInput.value = "";
        noteTitleInput.value = "";
        noteContentInput.value = "";
        saveNoteBtn.textContent = "Save Note"; 
        cancelEditBtn.style.display = "none"; 
    };

    const renderNotes = (notes) => {
        notesList.innerHTML = ""; 

        if (notes.length === 0) {
            notesList.innerHTML = "<p>No notes yet. Create one!</p>";
            return;
        }

        notes.forEach((note) => {
            const noteDiv = document.createElement("div");
            noteDiv.classList.add("note-item"); 

            const titleElement = document.createElement("h3");
            titleElement.textContent = note.title;

            const contentElement = document.createElement("p");
            contentElement.innerHTML = note.content.replace(/\n/g, '<br>');

            const timestampElement = document.createElement("small");
            const createdAt = new Date(note.createdAt).toLocaleString();
            const updatedAt = note.updatedAt ? new Date(note.updatedAt).toLocaleString() : null;
            timestampElement.textContent = `Created: ${createdAt}` + (updatedAt ? ` | Updated: ${updatedAt}` : '');

            const actionsDiv = document.createElement("div");
            actionsDiv.classList.add("note-actions");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit-btn");
            editButton.addEventListener("click", () => populateFormForEdit(note)); 

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-btn");
            deleteButton.addEventListener("click", () => deleteNote(note.id)); 

            actionsDiv.appendChild(editButton);
            actionsDiv.appendChild(deleteButton);

            noteDiv.appendChild(titleElement);
            noteDiv.appendChild(contentElement);
            noteDiv.appendChild(timestampElement);
            noteDiv.appendChild(actionsDiv);

            notesList.appendChild(noteDiv);
        });
    };

    const fetchNotes = async () => {
        try {
            const response = await fetch(API_BASE_URL); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notes = await response.json();
            renderNotes(notes); 
        } catch (error) {
            console.error("Error fetching notes:", error);
            notesList.innerHTML = `<p style="color: red;">Failed to load notes: ${error.message}. Please check server.</p>`;
        }
    };

    const addNote = async (note) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            clearForm(); 
            fetchNotes(); 
        } catch (error) {
            console.error("Error adding note:", error);
            alert(`Failed to add note: ${error.message}`);
        }
    };

    const updateNote = async (id, note) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(note),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            clearForm(); 
            fetchNotes(); 
        } catch (error) {
            console.error("Error updating note:", error);
            alert(`Failed to update note: ${error.message}`);
        }
    };

    const deleteNote = async (id) => {
        if (!confirm("Are you sure you want to delete this note?")) {
            return; 
        }
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                
                if (response.status === 204) {
                    console.log(`Note ${id} deleted successfully.`);
                } else {
                    const errorData = await response.json(); 
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
            }

            fetchNotes(); 
        } catch (error) {
            console.error("Error deleting note:", error);
            alert(`Failed to delete note: ${error.message}`);
        }
    };

    const populateFormForEdit = (note) => {
        noteIdInput.value = note.id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        saveNoteBtn.textContent = "Update Note"; 
        cancelEditBtn.style.display = "inline-block"; 
        noteTitleInput.focus(); 
    };

    

    
    noteForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const id = noteIdInput.value;
        const title = noteTitleInput.value.trim(); 
        const content = noteContentInput.value.trim();

        
        if (!title || !content) {
            alert("Title and Content cannot be empty!");
            return;
        }

        const noteData = { title, content };

        if (id) {
            
            updateNote(id, noteData);
        } else {
            
            addNote(noteData);
        }
    });

    
    cancelEditBtn.addEventListener("click", () => {
        clearForm(); 
    });

   
    fetchNotes();
});
