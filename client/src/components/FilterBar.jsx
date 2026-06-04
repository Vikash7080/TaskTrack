function FilterBar({ filter, setFilter }) {
  const filters = [
    {
      key: "all",
      label: "All",
      dot: "#3b82f6",
      activeStyle:
        "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm",
    },
    {
      key: "active",
      label: "Active",
      dot: "#f97316",
      activeStyle:
        "bg-orange-50 text-orange-700 border border-orange-200 shadow-sm",
    },
    {
      key: "completed",
      label: "Completed",
      dot: "#22c55e",
      activeStyle:
        "bg-green-50 text-green-700 border border-green-200 shadow-sm",
    },
  ];

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
        View tasks
      </p>

      <div className="inline-flex bg-gray-100 border border-gray-200 rounded-xl p-1 gap-0.5">
        {filters.map(
          ({ key, label, dot, activeStyle }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                flex items-center gap-1.5 px-5 py-2 rounded-[9px]
                text-sm font-medium transition-all duration-150
                ${
                  filter === key
                    ? activeStyle
                    : "text-gray-500 hover:bg-white hover:text-gray-800"
                }
              `}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: dot,
                }}
              />

              {label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default FilterBar;