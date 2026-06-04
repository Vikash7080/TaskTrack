import { useEffect, useState } from "react";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import TaskForm from "./components/TaskForm";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  reorderTasks,
    toggleImportant,
} from "./services/taskService";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

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
      toast.error("Failed to load tasks");
      console.error("Error fetching tasks:", error);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title.trim()) {
    toast.error("Task title is required");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  if (dueDate && dueDate < today) {
    toast.error(
      "Please select today's date or a future date. Past dates are not allowed."
    );
    return;
  }

  try {
    if (editingId) {
      await updateTask(editingId, {
        title,
        description,
        dueDate: dueDate || null,
      });

      toast.success("Task updated successfully");
    } else {
      await createTask({
        title,
        description,
        dueDate: dueDate || null,
      });

      toast.success("Task created successfully");
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingId(null);

    fetchTasks();
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  }
};

  const handleToggle = async (id) => {
    try {
      await toggleTask(id);
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      toast.error("Error updating task");
      console.error("Error toggling task:", error);
    }
  };
  const handleImportant = async (id) => {
  try {
    await toggleImportant(id);

    toast.success("Task priority updated");

    fetchTasks();
  } catch (error) {
    toast.error("Error updating priority");
    console.error(error);
  }
};

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Task?",
    text: "This action cannot be undone.",
    icon: "warning",

    width: "380px",

    showCancelButton: true,

    confirmButtonText: "Delete",
    cancelButtonText: "Keep Task",

    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#e2e8f0",

    background: "#ffffff",

    customClass: {
      popup: "rounded-3xl",
      title: "text-xl font-bold",
      htmlContainer: "text-slate-500",
      confirmButton: "px-5 py-2 rounded-xl font-medium",
      cancelButton:
        "px-5 py-2 rounded-xl font-medium text-slate-700",
    },

    reverseButtons: true,
    focusCancel: true,

    showClass: {
      popup: "animate__animated animate__fadeIn animate__faster",
    },

    hideClass: {
      popup: "animate__animated animate__fadeOut animate__faster",
    },
  });

  if (!result.isConfirmed) return;

  try {
    await deleteTask(id);
    toast.success("Task deleted successfully");
    fetchTasks();
  } catch (error) {
    toast.error("Error deleting task");
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

 const filteredTasks = tasks
  .filter((task) => {
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
  })
  .sort((a, b) => {
    if (a.important === b.important) return 0;
    return a.important ? -1 : 1;
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
      toast.error("Error reordering tasks");
      console.error(
        "Error reordering tasks:",
        error
      );
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

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
            </h2>

            {/* Search + Filter */}
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
                  Create your first task and start
                  tracking your work efficiently.
                </p>
              </div>
            ) : (
            <TaskList
  filteredTasks={filteredTasks}
  handleToggle={handleToggle}
  handleImportant={handleImportant}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  handleDragEnd={handleDragEnd}
/>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;