import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [dueDate, setDueDate] = useState("");
const [filter, setFilter] = useState("all");
const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title.trim()) {
    alert("Title is required");
    return;
  }

  try {
    await createTask({
      title,
      description,
      dueDate: dueDate || null,
    });

    setTitle("");
    setDescription("");
    setDueDate("");

    fetchTasks();
  } catch (error) {
    console.error("Error creating task:", error);
  }
};
const handleToggle = async (id) => {
  try {
    await toggleTask(id);
    fetchTasks();
  } catch (error) {
    console.error("Error toggling task:", error);
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!confirmDelete) return;

  try {
    await deleteTask(id);
    fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

  const activeTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;
const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesFilter =
    filter === "all"
      ? true
      : filter === "active"
      ? !task.completed
      : task.completed;

  return matchesSearch && matchesFilter;
});


  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <h1 className="text-3xl font-bold text-slate-800">
            TaskTrack
          </h1>
          <p className="text-slate-500">
            Manage your tasks efficiently
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 mb-8">
  <h2 className="text-xl font-semibold mb-4">
    Add New Task
  </h2>

  <form onSubmit={handleSubmit} className="space-y-4">

    <input
      type="text"
      placeholder="Task Title *"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border rounded-lg p-3"
    />

    <textarea
      placeholder="Description (optional)"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full border rounded-lg p-3"
      rows="3"
    />

    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      className="w-full border rounded-lg p-3"
    />

    <button
      type="submit"
      className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
    >
      Add Task
    </button>

  </form>
</div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-slate-500 text-sm">
              Total Tasks
            </h3>
            <p className="text-3xl font-bold mt-2">
              {tasks.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-slate-500 text-sm">
              Active Tasks
            </h3>
            <p className="text-3xl font-bold mt-2">
              {activeTasks}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-slate-500 text-sm">
              Completed Tasks
            </h3>
            <p className="text-3xl font-bold mt-2">
              {completedTasks}
            </p>
          </div>
        </div>
        
        {/* Task List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Tasks
          </h2>{/* Search */}
<div className="mt-8 mb-4">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full bg-white border rounded-lg p-3"
  />
</div>

{/* Filter Buttons */}
<div className="flex gap-3 mb-6">
  <button
    onClick={() => setFilter("all")}
    className={`px-4 py-2 rounded-lg ${
      filter === "all"
        ? "bg-blue-600 text-white"
        : "bg-white"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setFilter("active")}
    className={`px-4 py-2 rounded-lg ${
      filter === "active"
        ? "bg-blue-600 text-white"
        : "bg-white"
    }`}
  >
    Active
  </button>

  <button
    onClick={() => setFilter("completed")}
    className={`px-4 py-2 rounded-lg ${
      filter === "completed"
        ? "bg-blue-600 text-white"
        : "bg-white"
    }`}
  >
    Completed
  </button>
</div>


          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-center text-slate-500">
              No tasks found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-slate-600 mt-1">
                          {task.description}
                        </p>
                      )}

                      {task.dueDate && (
                        <p className="text-sm text-slate-500 mt-2">
                          Due:{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>

            <div className="flex gap-2">
  <button
    onClick={() => handleToggle(task._id)}
    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
      task.completed
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {task.completed ? "Completed" : "Active"}
  </button>

  <button
    onClick={() => handleDelete(task._id)}
    className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700"
  >
    Delete
  </button>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;