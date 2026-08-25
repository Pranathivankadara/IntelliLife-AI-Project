const Note = require("../models/Note");

// =========================================
// CREATE NOTE
// =========================================

const createNote = async (req, res) => {
    try {
        const { title, category, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        const note = await Note.create({
            user: req.user.id,
            title: title.trim(),
            category: category || "Study",
            content: content.trim()
        });

        return res.status(201).json({
            success: true,
            note
        });

    } catch (error) {
        console.error("Create Note Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create note."
        });
    }
};


// =========================================
// GET USER NOTES
// =========================================

const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            notes
        });

    } catch (error) {
        console.error("Get Notes Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notes."
        });
    }
};


// =========================================
// DELETE NOTE
// =========================================

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        await Note.deleteOne({
            _id: note._id
        });

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully."
        });

    } catch (error) {
        console.error("Delete Note Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete note."
        });
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    createNote,
    getNotes,
    deleteNote
};