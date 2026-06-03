import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import TaskForm from "./components/TaskForm";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import { reorderTasks } from "./services/taskService";
import {
  getTasks,
  createTask,
  updateTask,
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
const [editingId, setEditingId] = useState(null);

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
    if (editingId) {
      await updateTask(editingId, {
        title,
        description,
        dueDate: dueDate || null,
      });
    } else {
      await createTask({
        title,
        description,
        dueDate: dueDate || null,
      });
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingId(null);

    fetchTasks();
  } catch (error) {
    console.error(error);
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
const handleEdit = (task) => {
  setEditingId(task._id);
  setTitle(task.title);
  setDescription(task.description || "");
  setDueDate(
    task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : ""
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
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
const handleDragEnd = async (result) => {
  if (!result.destination) return;

  const items = [...tasks];

  const [reorderedItem] = items.splice(
    result.source.index,
    1
  );

  items.splice(
    result.destination.index,
    0,
    reorderedItem
  );

  setTasks(items);

  try {
    await reorderTasks(items);
  } catch (error) {
    console.error(
      "Error reordering tasks:",
      error
    );
  }
};


  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
    <Header />

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-8">
<TaskForm
  title={title}
  setTitle={setTitle}
  description={description}
  setDescription={setDescription}
  dueDate={dueDate}
  setDueDate={setDueDate}
  editingId={editingId}
  setEditingId={setEditingId}
  handleSubmit={handleSubmit}
/>
        {/* Stats Cards */}
      <StatsCards
  totalTasks={tasks.length}
  activeTasks={activeTasks}
  completedTasks={completedTasks}
/>
        
        {/* Task List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Tasks
          </h2>{/* Search */}
<div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">

  <div className="w-full md:w-1/2">
    <SearchBar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  </div>

  <FilterBar
    filter={filter}
    setFilter={setFilter}
  />

</div>


          {tasks.length === 0 ? (
         <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
  <div className="text-5xl mb-4">
    📝
  </div>

  <h3 className="text-xl font-semibold">
    No tasks found
  </h3>

  <p className="text-slate-500 mt-2">
    Create your first task and start tracking your work efficiently.
  </p>
</div>
          ) : (
<TaskList
  filteredTasks={filteredTasks}
  handleToggle={handleToggle}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  handleDragEnd={handleDragEnd}
/>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;