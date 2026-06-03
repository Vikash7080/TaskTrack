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
   
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Edit Task" : "Add New Task"}
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

     <div className="flex gap-3">
  <button
    type="submit"
    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
  >
    {editingId ? "Update Task" : "Add Task"}
  </button>

  {editingId ? (
    <button
      type="button"
      onClick={() => {
        setTitle("");
        setDescription("");
        setDueDate("");
        setEditingId(null);
      }}
      className="bg-gray-200 px-5 py-3 rounded-lg hover:bg-gray-300"
    >
      Cancel
    </button>
  ) : null}
</div>
      </form>
    </div>
  );
}

export default TaskForm;