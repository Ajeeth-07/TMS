import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) : Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(400).json({ message: "User already exists" });
       return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) : Promise<void> => {
  //TODO :  Similar implementation as signup
    try{
        const {email, password} = req.body;

        //finding user
        const user = await prisma.user.findUnique({where : {email}});

        if(!user){
             res.status(400).json({message:"Invalid credentials"});
             return
        }

        //verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
          res.status(400).json({ message: "invalid credentials" });
          return;
        } 

        //generate token
        const token = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET || "fallback_secret",
            {expiresIn: "24h"}
        );

        res.json({
            message:"Login Successful",
            token,
            user:{
                id:user.id,
                email:user.email,
                name:user.name
            }
        });
    }catch(err){
        res.status(500).json({message:"Server error", err});
    }
};
