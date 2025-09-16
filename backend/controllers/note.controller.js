import Note from "../models/Note.model.js"
import Tenant from "../models/Tenant.model.js"

export async function createNote(req, res) {
    const user = req.user
    const { title, content } = req.body

    if (!title || !content) {
        return res.status(400).json({ message: "Please update both title and content" })
    }

    try {
        const notesCount = await Note.countDocuments({ tenantId: user.tenantId })
        const tenant = await Tenant.findById(user.tenantId)

        if (!user.tenantId) {
            return res.status(400).json({ message: "User is not assigned to any tenant" })
        }

        if (tenant.subscription !== "Pro" && notesCount >= 3) {
            return res.status(403).json({ message: "The subscription has expired, please ask your admin to upgrade to Pro." })
        }

        const newNote = await Note.create({ title, content, createdBy: user.id, tenantId: user.tenantId })

        return res.status(201).json({ newNote })
    } catch (error) {
        return res.status(500).json({ message: "Server error while creating a note", error: error.message })
    }
}

export async function fetchAllNotes(req, res) {
    const user = req.user

    try {
        const allNotes = await Note.find({ tenantId: user.tenantId }).populate("createdBy")

        return res.status(200).json({ allNotes })
    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching all notes", error: error.message })
    }
}

export async function fetchNote(req, res) {
    const user = req.user
    const { id } = req.params

    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }
        if (note.tenantId.toString() !== user.tenantId.toString()) {
            return res.status(403).json({ message: "You are not authorized to view this note" })
        }

        return res.status(200).json({ note })
    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching a note", error: error.message })
    }
}

export async function updateNote(req, res) {
    const user = req.user
    const { id } = req.params
    const { title, content } = req.body

    if (!title && !content) {
        return res.status(400).json({ message: "Atleast one field is requied to update." })
    }

    const updates = {}
    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }
        if (note.tenantId.toString() !== user.tenantId.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this note" })
        }

        if (note.createdBy.toString() !== user.id.toString()) {
            return res.status(403).json({ message: "You cannot edit this note" })
        }

        if (title) updates.title = title
        if (content) updates.content = content

        const updatedNote = await Note.findByIdAndUpdate(id, { $set: updates }, { new: true })
        return res.status(200).json({ updatedNote })
    } catch (error) {
        return res.status(500).json({ message: "Server error while updating a note", error: error.message })
    }
}

export async function deleteNote(req, res) {
    const user = req.user
    const { id } = req.params

    try {
        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({ message: "Note not found" })
        }

        if (note.tenantId.toString() !== user.tenantId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this note" })
        }

        if (user.role !== "Admin" && note.createdBy.toString() !== user.id.toString()) {
            return res.status(403).json({ message: "Only admins can delete others' notes" })
        }

        await note.deleteOne()
        return res.status(200).json({ message: "Note deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error while deleting a note", error: error.message })
    }
}