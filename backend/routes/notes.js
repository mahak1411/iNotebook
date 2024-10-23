const express = require('express');
const router = express.Router();
let fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require("express-validator");


// ROUTE:1
// Get all the notes of the user using : GET "/api/notes/fetchAllNotes" . Login required
router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route: 2
// Add a new note using POST : "/api/notes/addNote " . login required
router.post('/addNote', fetchUser, [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be of at least 5 character").isLength({ min: 5 }),
], async (req, res) => {
    const { title, description, tag } = req.body;
    // If there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await notes.save();
        res.json(savedNote);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

// ROUTE : 3
// Update an Existing Note using : PUT "/api/notes/updateNote" . Login Required
router.put('/updateNote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Create a new Note object
        const newNote = {};
        if (title) {
            newNote.title = title
        }
        if (description) {
            newNote.description = description
        }
        if (tag) {
            newNote.tag = tag
        }

        // Find the note to be updated and update it
        let note = await Notes.findById(req.params.id);

        if (!note) {
            return res.status(400).json({ error: "Not Found!" });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});


// ROUTE : 4
// Delete a existing Note using :DELETE /api/notes/deleteNote/:id  , Login required
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note that is to be deleted using req.params.id
        let note = await Notes.findById(req.params.id);

        // Check if the note exists
        if (!note) {
            return res.status(404).json({ error: "Not Found!" });
        }

        // Making sure that the user owns the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Delete the note
        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});



module.exports = router;