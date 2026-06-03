function FilterBar({
  filter,
  setFilter,
}) {
  return (
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
  );
}

export default FilterBar;