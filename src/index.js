import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // Socket aur Server yahan se aa rahe hain

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// --- Middlewares ---
app.use(express.json({ limit: "10mb" })); // Limit badhayi taaki future mein photos bhej sakein
app.use(cookieParser());

// CORS configuration
const frontendUrl = process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// --- Deployment Setup ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Path check karlein backend ke bahar hai ya andar

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// --- Server Start ---
// Hamesha 'server.listen' use karein 'app.listen' nahi
server.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT: ${PORT}`);
  connectDB();
});