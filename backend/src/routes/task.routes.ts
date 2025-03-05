import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateTask } from "../validators/task.validator";

const router = Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

router.post("/", validateTask, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

export default router;
