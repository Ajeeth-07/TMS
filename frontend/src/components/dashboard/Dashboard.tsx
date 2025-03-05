import { useNavigate } from "react-router-dom";
import { Task } from "../../interfaces/tasks.types";
import { useState } from "react";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    //TODO: logout logic to be implemented
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
            className="text-white hover:text-gray-200"
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
          <button className="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
            Add New Task
          </button>
        </div>

        <div className="mt-8">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No Tasks Found. Create one task to get started
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
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
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
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
      </main>
    </div>
  );
};

export default Dashboard;
