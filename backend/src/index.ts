import express from "express";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes"
import { errorHandler } from "./middlewares/errorMiddleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
