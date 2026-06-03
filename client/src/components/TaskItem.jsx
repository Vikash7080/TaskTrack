import {
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
function TaskItem({
  task,
  handleToggle,
  handleEdit,
  handleDelete,
}) {
  return (
    <div
    className={`rounded-2xl border p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) < new Date()
          ? "bg-red-50 border border-red-300"
          : "bg-white"
      }`}
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

          {!task.completed &&
            task.dueDate &&
            new Date(task.dueDate) < new Date() && (
              <p className="text-red-600 text-sm font-medium mt-2">
                Overdue
              </p>
            )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              handleToggle(task._id)
            }
className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
              task.completed
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {task.completed
              ? "Completed"
              : "Active"}
          </button>

         <button
  onClick={() => handleEdit(task)}
  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
>
  <FiEdit />
  Edit
</button>

          <button
  onClick={() => handleDelete(task._id)}
  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
>
  <FiTrash2 />
  Delete
</button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;