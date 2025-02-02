require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

const DataSchema = new mongoose.Schema({ input: String });
const Data = mongoose.model("Data", DataSchema);

// API Route to Submit Data
app.post("/submit", async (req, res) => {
    try {
        const { input } = req.body;
        if (!input) return res.status(400).json({ error: "Input is required" });

        const newData = new Data({ input });
        await newData.save();
        res.json({ message: "Data saved!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API Route to Fetch Data
app.get("/data", async (req, res) => {
    try {
        const allData = await Data.find();
        res.json(allData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
