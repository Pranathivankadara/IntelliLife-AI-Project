const express = require("express");

const router = express.Router();

const {
    createNote,
    getNotes,
    deleteNote
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// CREATE NOTE
// POST /api/notes
// =========================================

router.post(
    "/",
    authMiddleware,
    createNote
);


// =========================================
// GET NOTES
// GET /api/notes
// =========================================

router.get(
    "/",
    authMiddleware,
    getNotes
);


// =========================================
// DELETE NOTE
// DELETE /api/notes/:id
// =========================================

router.delete(
    "/:id",
    authMiddleware,
    deleteNote
);


module.exports = router;