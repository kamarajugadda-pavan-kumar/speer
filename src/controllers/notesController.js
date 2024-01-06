const notesModel = require("../modals/notesModel");

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Retrieve all notes for the authenticated user
    const notes = await notesModel.getAllNotesByUserId(userId);

    res.json({ notes });
  } catch (error) {
    console.error("Error getting all notes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getNoteById = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have the userId in the req.user object
    const noteId = parseInt(req.params.id, 10);

    // Retrieve the note by ID for the authenticated user
    const note = await notesModel.getNoteByIdAndUserId(noteId, userId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note });
  } catch (error) {
    console.error("Error getting note by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNote = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have the userId in the req.user object
    const { title, content } = req.body;

    // Create a new note for the authenticated user
    const newNote = await notesModel.createNote({ userId, title, content });

    res.status(201).json({ note: newNote });
  } catch (error) {
    console.error("Error creating a new note:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateNote = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have the userId in the req.user object
    const noteId = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    // Update an existing note by ID for the authenticated user
    const updatedNote = await notesModel.updateNoteByIdAndUserId(
      noteId,
      userId,
      { title, content }
    );

    // Check if the note exists
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note: updatedNote });
  } catch (error) {
    console.error("Error updating note by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = parseInt(req.params.id, 10);

    // Delete a note by ID for the authenticated user
    const deletedNote = await notesModel.deleteNoteByIdAndUserId(
      noteId,
      userId
    );

    // Check if the note exists
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const shareNote = async (req, res) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { recipientUserId } = req.body;

    // check if the note exists
    // check if the user sharing the notes has permission to access note
    // check if the recipent user exists
    // Share a note with another user for the authenticated user
    const { status, ...note } = await notesModel.checkNoteSharingConditions(
      noteId,
      userId,
      recipientUserId
    );

    if (status === "Note not found") {
      res.status(404).json({ message: status });
    } else if (status === "Permission denied") {
      res.status(403).json({ message: status });
    } else if (status === "Recipient user not found") {
      res.status(404).json({ message: status });
    } else if (status === "cannot share with self") {
      res.status(400).json({ message: status });
    } else {
      // All conditions met, proceed to share the note
      await notesModel.shareNoteByIdAndUserId(noteId, recipientUserId);
      res.json({ message: "Note shared successfully" });
    }
  } catch (error) {
    console.error("Error sharing note:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = req.query.q;

    // Search for notes based on keywords for the authenticated user
    const searchResults = await notesModel.searchNotesByUserIdAndQuery(
      userId,
      query
    );

    res.json({ notes: searchResults });
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
