import React, { useState } from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) => {
    const host = 'http://localhost:5000';
    const notesInit = [];
    const [notes, setNotes] = useState(notesInit);

    // Get all notes
    const getAllNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchAllNotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        const json = await response.json();
        
        // Check if the response is an array before setting notes
        if (Array.isArray(json)) {
            setNotes(json);
        } else {
            console.error("Expected an array but got:", json);
            setNotes([]); // Handle non-array response
        }
    };

    // Add a note
    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addNote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        const note = await response.json();
        console.log("Adding a new note", note);
        
        // Ensure that we concatenate the new note to the existing notes array
        setNotes((prevNotes) => [...prevNotes, note]);
    };

    // Edit a note
    const editNote = async (id, title, description, tag) => {
        const response = await fetch(`${host}/api/notes/updateNote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });

        const json = await response.json();
        
        // Create a new array to update the state
        setNotes((prevNotes) => prevNotes.map(note => 
            note._id === id ? { ...note, title, description, tag } : note
        ));

    };

    // Delete a note
    const deleteNote = async (id, showAlert) => {
        const response = await fetch(`${host}/api/notes/deleteNote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });
        await response.json(); // Ensure the response is awaited
        console.log("Note deleted with ID:", id);
        showAlert("Note deleted Successfully","success")

        // Update the state after deletion
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    };

    return (
        <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, getAllNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
}

export default NoteState;
