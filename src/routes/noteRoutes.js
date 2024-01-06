// src/routes/noteRoutes.js
const express = require("express");
const notesController = require("../controllers/notesController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/notes", authMiddleware, notesController.getAllNotes);
router.get("/api/notes/:id", authMiddleware, notesController.getNoteById);
router.post("/api/notes", authMiddleware, notesController.createNote);
router.put("/api/notes/:id", authMiddleware, notesController.updateNote);
router.delete("/api/notes/:id", authMiddleware, notesController.deleteNote);
router.post("/api/notes/:id/share", authMiddleware, notesController.shareNote);
router.get("/api/search", authMiddleware, notesController.searchNotes);

module.exports = router;
