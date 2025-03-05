import { useNavigate } from "react-router-dom";
import { Task } from "../../interfaces/tasks.types";
import { useEffect, useState } from "react";
import AddTask from "../tasks/AddTask";
import EditTask from "../tasks/EditTask";
import api from "../../services/api";
import { AxiosError } from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error(err);
      if ((err as AxiosError).response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData: {
    title: string;
    content: string;
    priority: string;
  }) => {
    // Create a new task object
    try {
      const response = await api.post("/tasks", taskData);
      setTasks([...tasks, response.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (
    taskId: number,
    updatedData: Partial<Task>
  ) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updatedData);
      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (task: Task) => {
    setCurrentTask(task);
    setIsEditTaskOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            Task Management System
          </h1>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-boldtext-gray-900">Your Tasks</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your track and tasks
            </p>
          </div>
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
          >
            Add New Task
          </button>
        </div>

        <div className="mt-8">
          {!tasks ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No Tasks Found. Create one task to get started
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {Array.isArray(tasks) &&
                  tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`px-6 py-4 hover:bg-gray-50 ${
                        task.completed ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            {task.completed && (
                              <span className="mr-2 text-green-600 text-xl">
                                ✓
                              </span>
                            )}
                            <h3
                              className={`text-lg font-medium ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h3>
                          </div>
                          <p
                            className={`mt-1 text-sm ${
                              task.completed
                                ? "line-through text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {task.content}
                          </p>
                        </div>
                        <div className="flex space-x-4 items-center">
                          <span
                            className={`px-2 py-1 text-sm rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <button
                            onClick={() => handleEditClick(task)}
                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <AddTask
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          onAdd={handleAddTask}
        />
        <EditTask
          isOpen={isEditTaskOpen}
          onClose={() => setIsEditTaskOpen(false)}
          onUpdate={handleUpdateTask}
          task={currentTask}
        />
      </main>
    </div>
  );
};

export default Dashboard;
