import {
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiAlertTriangle,
  FiStar,
} from "react-icons/fi";

function TaskItem({
  task,
  handleToggle,
  handleImportant,
  handleEdit,
  handleDelete,
}) {
  const isOverdue =
    !task.completed &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  const daysOverdue = isOverdue
    ? Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
       border: isOverdue
  ? "1.5px solid #fca5a5"
  : task.important
  ? "2px solid #fbbf24"
  : task.completed
  ? "1.5px solid #bbf7d0"
  : "1.5px solid #e2e8f0",
        background: isOverdue
          ? "linear-gradient(135deg, #fff5f5 0%, #fff 60%)"
          : task.completed
          ? "linear-gradient(135deg, #f0fdf4 0%, #fff 60%)"
          : "#fff",
        padding: "0",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        boxShadow: isOverdue
          ? "0 4px 24px rgba(239,68,68,0.10)"
          : "0 2px 12px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = isOverdue
          ? "0 12px 32px rgba(239,68,68,0.18)"
          : "0 12px 32px rgba(0,0,0,0.10)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isOverdue
          ? "0 4px 24px rgba(239,68,68,0.10)"
          : "0 2px 12px rgba(0,0,0,0.05)";
      }}
    >
      {/* Overdue Alert Banner */}
      {isOverdue && (
        <div
          style={{
            background: "linear-gradient(90deg, #ef4444 0%, #f97316 100%)",
            padding: "7px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px" }}>⚠️</span>
          <span
            style={{
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Overdue
            {daysOverdue > 0 && ` · ${daysOverdue} day${daysOverdue > 1 ? "s" : ""} past due`}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "rgba(255,255,255,0.8)",
              fontWeight: "500",
            }}
          >
            Action needed
          </span>
        </div>
      )}

      {/* Main Card Body */}
      <div style={{ padding: "20px 24px 20px 20px", display: "flex", gap: "16px" }}>
        {/* Left accent bar */}
        <div
          style={{
            width: "4px",
            borderRadius: "4px",
            flexShrink: 0,
            alignSelf: "stretch",
            background: task.completed
              ? "#22c55e"
              : isOverdue
              ? "linear-gradient(180deg, #ef4444, #f97316)"
              : "#f97316",
          }}
        />

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Title row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "17px",
                fontWeight: "700",
                color: task.completed ? "#94a3b8" : "#1e293b",
              }}
            >
              {task.title}
            </h3>

            {/* Status pill */}
            <span
              style={{
                borderRadius: "999px",
                padding: "3px 12px",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.04em",
                background: task.completed ? "#dcfce7" : "#fff7ed",
                color: task.completed ? "#15803d" : "#c2410c",
                border: task.completed ? "1px solid #bbf7d0" : "1px solid #fed7aa",
              }}
            >
              {task.completed ? "✓ Completed" : "⏳ Active"}
            </span>
          </div>
{task.important && (
  <span
    style={{
      borderRadius: "999px",
      padding: "3px 12px",
      fontSize: "11px",
      fontWeight: "700",
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fde68a",
    }}
  >
    ⭐ Important
  </span>
)}
          {/* Description */}
          {task.description && (
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: task.completed ? "#b0bec5" : "#64748b",
                lineHeight: "1.6",
                maxWidth: "600px",
              }}
            >
              {task.description}
            </p>
          )}

          {/* Due date */}
          {task.dueDate && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: isOverdue ? "#ef4444" : "#94a3b8",
                fontWeight: isOverdue ? "600" : "400",
                background: isOverdue ? "#fef2f2" : "transparent",
                padding: isOverdue ? "4px 10px" : "0",
                borderRadius: "8px",
                border: isOverdue ? "1px solid #fecaca" : "none",
                width: "fit-content",
              }}
            >
              {isOverdue ? <FiAlertTriangle size={13} /> : <FiCalendar size={13} />}
              <span>
                {isOverdue ? "Was due: " : "Due: "}
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Toggle */}
          <button
            onClick={() => handleToggle(task._id)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              background: task.completed ? "#dcfce7" : "#fff7ed",
              color: task.completed ? "#15803d" : "#c2410c",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = task.completed ? "#bbf7d0" : "#fed7aa";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = task.completed ? "#dcfce7" : "#fff7ed";
            }}
          >
            {task.completed ? "✓ Done" : "⏳ Active"}
          </button>
          <button
  onClick={() => handleImportant(task._id)}
  style={{
    cursor: "pointer",
    border: "none",
    borderRadius: "12px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
    background: task.important ? "#fef3c7" : "#f8fafc",
    color: task.important ? "#d97706" : "#64748b",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
>
  <FiStar size={13} />
  {task.important ? "Important" : "Mark Important"}
</button>

          {/* Edit */}
          <button
            onClick={() => handleEdit(task)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              background: "#eff6ff",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#dbeafe")}
            onMouseLeave={e => (e.currentTarget.style.background = "#eff6ff")}
          >
            <FiEdit size={13} />
            Edit
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(task._id)}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "12px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: "600",
              background: "#fff1f2",
              color: "#be123c",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ffe4e6")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff1f2")}
          >
            <FiTrash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;