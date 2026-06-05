import React from "react";

function TaskForm({
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  editingId,
  setEditingId,
  handleSubmit,
}) {
  const today = new Date().toISOString().split("T")[0];

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
          📝
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {editingId ? "Edit Task" : "Create New Task"}
          </h2>

          <p className="text-sm text-gray-500">
            Organize your tasks and boost your productivity.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
            className="w-full border border-gray-300 rounded-xl p-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="text-right text-xs text-gray-400 mt-1">
            {title.length}/100
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            placeholder="Add task details (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            maxLength={300}
            className="w-full border border-gray-300 rounded-xl p-3 outline-none resize-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="text-right text-xs text-gray-400 mt-1">
            {description.length}/300
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>

          <input
            type="date"
            min={today}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <p className="text-xs text-gray-500 mt-2">
            📅 Only today or future dates are allowed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            {editingId ? "✏️ Update Task" : "➕ Add Task"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;