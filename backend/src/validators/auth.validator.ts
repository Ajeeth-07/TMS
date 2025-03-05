import { z } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Schema definitions
export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
  })
});

// Validation middleware
export const validateSignup: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    signupSchema.parse({ body: req.body });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ 
        message: "Validation failed", 
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      });
      return;
    }
     res.status(400).json({ message: "Invalid request data" });
     return;
  }
};

export const validateLogin : RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse({ body: req.body });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
       res.status(400).json({ 
        message: "Validation failed", 
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      });
      return;
    }
     res.status(400).json({ message: "Invalid request data" });
     return;
  }
};