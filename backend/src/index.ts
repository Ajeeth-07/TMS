import express, {Request,Response,NextFunction} from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.post("/api/auth/signup", async (req:Request, res:Response) : Promise<void> => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
       res.status(400).json({ error: "User with this email already exists" });
       return
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    
    // Return user info (without password) and token
    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});