import { z } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string(),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    completed: z.boolean().optional().default(false),
    dueDate: z.string().optional().refine(
      (date) => !date || !isNaN(Date.parse(date)), 
      { message: "Invalid date format" }
    )
  })
});

export const validateTask : RequestHandler = (req: Request, res: Response, next: NextFunction) =>  {
  try {
    taskSchema.parse({ body: req.body });
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