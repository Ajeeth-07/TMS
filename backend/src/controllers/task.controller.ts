import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Define interface for task updates
interface TaskUpdateData {
  title?: string;
  content?: string;
  completed?: boolean;
  dueDate?: Date | undefined;
  priority?: string;
}

const prisma = new PrismaClient();

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await prisma.task.count({
      where: { authorId: req.userId },
    });

    const tasks = await prisma.task.findMany({
      where: { authorId: req.userId },
      orderBy: {
        updatedAt: "desc", //most recent updated
      },
      skip,
      take: limit,
    });

    res.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (task.authorId !== req.userId) {
      res.status(404).json({ message: "Not authorized" });
      return;
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, content, dueDate, priority } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        content,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        authorId: req.userId!,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, content, completed, dueDate, priority } = req.body;

    //check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!existingTask) {
      res.status(404).json({ message: "task not found" });
      return;
    }

    if (existingTask.authorId !== req.userId) {
      res.status(403).json({ message: "Not authorised" });
      return;
    }

    const task = await prisma.task.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content,
        completed,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!existingTask) {
      res.status(404).json({ message: "task not found" });
      return;
    }

    if (existingTask.authorId !== req.userId) {
      res.status(403).json({ message: "Not authorised" });
      return;
    }

    await prisma.task.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const bulkUpdateTasks = async (req: Request, res: Response) => {
  try {
    const { taskIds, updates } = req.body;

    // Use transaction for bulk updates
    const results = await prisma.$transaction(async (tx) => {
      // First verify all tasks belong to user
      const tasks = await tx.task.findMany({
        where: {
          id: { in: taskIds },
        },
      });

      // Check ownership
      const unauthorized = tasks.some((task) => task.authorId !== req.userId);
      if (unauthorized) {
        throw new Error("Unauthorized access to one or more tasks");
      }

      // Perform updates
    return await Promise.all(
      taskIds.map((id: number) =>
        tx.task.update({
        where: { id },
        data: updates as TaskUpdateData,
        })
      )
    );
    });

    res.json({
      message: "Bulk update successful",
      count: results.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
