import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createNote, deleteNote, fetchAllNotes, fetchNote, updateNote } from "../controllers/note.controller.js";

const notesRouter = Router()

notesRouter.post("/", protect, createNote)
notesRouter.get("/", protect, fetchAllNotes)
notesRouter.get("/:id", protect, fetchNote)
notesRouter.put("/:id", protect, updateNote)
notesRouter.delete("/:id", protect, deleteNote)

export default notesRouter