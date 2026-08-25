const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// =========================================
// Middleware
// =========================================
app.use(cors());
app.use(express.json());

// =========================================
// MongoDB Connection
// =========================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server Running on Port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Failed");
        console.log(err.message);
    });

// =========================================
// Routes
// =========================================
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

// ⭐ AI Assistant Route
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
// =========================================
// Test Route
// =========================================
app.get("/", (req, res) => {
    res.send("Backend Working 🚀");
});