document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('note-form');
    const message = document.getElementById('message');
    const notesContainer = document.getElementById('notes-container');
    const searchInput = document.getElementById('search');
  
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const date = document.getElementById('date').value;
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value;
  
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, category, description })
      });
  
      const data = await response.json();
      message.textContent = data.message;
      noteForm.reset();
      fetchNotes();
    });
  
    async function fetchNotes() {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      notesContainer.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
        <div class = "note-btn">
            <button onclick="editNote('${note._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
          </div>
            <div class = "note-btn">     
          <button onclick="deleteNote('${note._id}')"><i class="fa-solid fa-trash"></i></button></div>
          <h3>${note.title}</h3>
          <p>${note.description}</p>
          
          <p>${note.category}</p>
          <div class = "notedate"><p>${note.date}</p></div>
          
          
        `;
        notesContainer.appendChild(noteElement);
      });
    }
  
    window.editNote = async function (id) {
      const title = prompt('Enter new title:');
      const description = prompt('Enter new description:');
      const date = prompt('Enter new date:');
      const category = prompt('Enter new category:');
  
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date, category })
      });
  
      const data = await response.json();
      message.textContent = data.message;
      fetchNotes();
    };
  
    window.deleteNote = async function (id) {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
      });
  
      const data = await response.json();
      message.textContent = data.message;
      fetchNotes();
    };
  
    searchInput.addEventListener('input', async () => {
      const query = searchInput.value.toLowerCase();
      const response = await fetch('/api/notes');
      const notes = await response.json();
      const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query)
      );
      notesContainer.innerHTML = '';
      filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
          <div class = "note-btn">
            <button onclick="editNote('${note._id}')"><i class="fa-regular fa-pen-to-square"></i></button>
          </div>
            <div class = "note-btn">     
          <button onclick="deleteNote('${note._id}')"><i class="fa-solid fa-trash"></i></button></div>
          <h3>${note.title}</h3>
          <p>${note.description}</p>
          
          <p>${note.category}</p>
          <div class = "notedate"><p>${note.date}</p></div>
        `;
        notesContainer.appendChild(noteElement);
      });
    });
  
    fetchNotes();
  });
  