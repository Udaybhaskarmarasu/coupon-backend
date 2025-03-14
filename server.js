const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Configure CORS properly
app.use(cors({
    origin: "http://localhost:3000", // Allow frontend origin
    credentials: true // Allow cookies & authentication headers
}));

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const couponRoutes = require("./routes/coupon");
app.use("/api", couponRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
